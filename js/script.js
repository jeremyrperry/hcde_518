/*
window.addEventListener('orientationchange', changeOrientation);

function changeOrientation(){
    var height = $(window).height();
    var width = $(window).width();
    var aHeight = $('#app').height();
    var aWidth = $('#app').width();
    var fHeight = $('footer').height();
    $('section').each(function(){
        var sHeight = $(this).height();
        var sWidth = $(this).width();
        var top  = (aHeight - fHeight - sHeight)/2;
        $(this).css({
            'top': top,
            'width': eval(aWidth - 40),
        });
    });
}
*/

var revealCare = {
    currentSection: '#home',
    geocoder: null,
    loggedIn: false,
    mapSet: false,
    searchInfo: [],
    reviewData: [],
    userInfo: [],
    webServiceUrl: 'http://phad.phluant.net',
    reviewUrl: ' http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com/aws-server/',

    capitalize: function(str){
        return str.charAt(0).toUpperCase()+str.slice(1);
    },

    checkCookie: function(value){
        var checkVal = this.getCookie(value);
        if(checkVal!=null && checkVal!=""){
            return checkVal;
        }
        else{
            return false;
        }
    },

    checkLogin: function(){
        var email = this.checkCookie('email');
        if(email){
            $('#login_link').attr('class', 'logout');
            $('#login_link').html('Logout');
            $('#username').html(email);
            this.loggedIn = true;
        }
    },

    getCookie: function(c_name){
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1)
          {
          c_start = c_value.indexOf(c_name + "=");
          }
        if (c_start == -1)
          {
          c_value = null;
          }
        else
          {
          c_start = c_value.indexOf("=", c_start) + 1;
          var c_end = c_value.indexOf(";", c_start);
          if (c_end == -1)
          {
        c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
        }
        return c_value;
    },

    getLocation: function(){
        var address = this.userInfo.lat+','+this.userInfo.lng;
        console.log(address);
        /*
        this.geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var googleAddress = results[0].formatted_address.split(',');
                var stateZip = $.trim(googleAddress[2]).split(' ');
                revealCare.userInfo.city = $.trim(googleAddress[1]);
                revealCare.userInfo.state = $.trim(stateZip[0]);
                revealCare.userInfo.zip = $.trim(stateZip[1]);
                 console.log("Google intended address: "+revealCare.userInfo.city+','+revealCare.userInfo.state+','+revealCare.userInfo.zip);
            }
            else{
            */
                $.get(revealCare.webServiceUrl+'/web_services/geolocation/export?type=city_postal_by_geo&value='+address, function(d){
                    var data = jQuery.parseJSON(d);
                    revealCare.userInfo.city = data.results.city;
                    revealCare.userInfo.state = data.results.state_region;
                    revealCare.userInfo.zip = data.results.postal_code;
                });
            //}
        //});
    },

    init: function(){
        var loc = window.location.href;
        var index = loc.indexOf('#');
        if (index > 0) {
          window.location = loc.substring(0, index);
        }
        this.checkLogin();
        //this.geocoder = new google.maps.Geocoder();
        navigator.geolocation.getCurrentPosition(function(position){
            revealCare.userInfo.lat = position.coords.latitude;
            revealCare.userInfo.lng = position.coords.longitude;
            revealCare.getLocation();
            
        },function(e){
            console.log('by ip');
            $.get(revealCare.webServiceUrl+'/web_services/geolocation/export?type=ip_address', function(d){
                 var data = jQuery.parseJSON(d);
                revealCare.userInfo.lat = data.results.lat;
                revealCare.userInfo.lng = data.results.lng;
                revealCare.userInfo.city = data.results.city;
                revealCare.userInfo.state = data.results.state_region;
                revealCare.userInfo.zip = data.results.postal_code;
                //console.log("got by Web Services: "+revealCare.userInfo.city+','+revealCare.userInfo.state+','+revealCare.userInfo.zip);
                revealCare.exitSplash();
            });
        });
        $('#distance_type').click(function(){
            if($(this).hasClass('miles')){
                console.log('has miles');
                $(this).removeClass('miles');
                $(this).addClass('kilometers');
                $(this).html('Kilometers');
            }
            else{
                $(this).removeClass('kilometers');
                $(this).addClass('miles');
                $(this).html('Miles');
            }
        });
        $('#login_form, #reg_from').submit(function(f){
            f.preventDefault();
            revealCare.loggedIn = true;
            $(this).find('input').each(function(){
                revealCare.userInfo[$(this).attr('name')] = $(this).val();
            });
            revealCare.setCookie('email', $(this).find('.email').val(), 14);
            revealCare.checkLogin();
            var dest = $(this).find('.redirect').val();
            window.location = dest;
        });
        $('form .submit').click(function(){
            $(this).closest('form').trigger('submit');
        });
        $('form .clear').click(function(){
            $(this).closest('form').find('input[type="text"]').val('');
        });
        $('.link').click(function(){
            var type = $(this).attr('id').replace('_div', '');
            console.log(type);
            window.location.hash = type;
        });

        /*
        
        */
        $('.search_form').submit(function(f){
            f.preventDefault();
            var type = $(this).attr('id').replace('_form', '');
            var have =  {
                'treatment': new Array('acl', 'mcl', 'meniscus'),
                'doctor': new Array('judity lindsay', 'thomas green', 'silvia jordan', 'joe smith'),
                'facility': new Array('harborview medical', 'group health', 'emanuel hospital', 'legacy good sam'),
            };
            var query = $(this).find(".search_field").val().toLowerCase();
            var proceed = false;
            proceedTo = 'search_results_map';
            console.log(type);
            if(have[type].indexOf(query) != -1){
                console.log('proceeding');
                if(type == 'treatment'){
                    type = query;
                }
                proceed = true;
            }
            else{
                var c = confirm('Nothing found for your query.  Would you like to see available results?');
                if(c){
                    proceed = true;
                    if(type == 'treatment'){
                        proceedTo = 'treatment_search_results';
                    }
                }               
            }
            if(proceed){
                revealCare.resultsMap(type);
                window.location.hash = proceedTo;
            }
            else{
                return false;
            }
        });
        $('#login_link').click(function(){
            alert('in function');
            if(revealCare.loggedIn){
                revealCare.logout();
            }
            else{
                window.location.hash = 'login';
            }
        });
        /*
        $('.review_back').click(function(){
            var backTo = $(this).closest('form').attr('id').replace('review_form_', '');
            backTo--;
            $(this).closest('div').hide();
            $('#review_div_'+backTo).show();
        });
        */
        $('.review_form_1').submit(function(f){
            f.preventDefault();
            var overall = 0;
            revealCare.reviewData['date'] = $(this).find('input[type="date"]').val();
            $(this).find('input[type="radio"]:checked').each(function(){
                console.log($(this).attr('name'));
                console.log($(this).val());
                revealCare.reviewData[$(this).attr('name')] = $(this).val();
                overall = eval(overall+'+'+$(this).val());
                console.log(overall);
            });
            console.log('done adding');
            console.log(overall);
            overall = overall/4;
            console.log(overall);
            revealCare.reviewData['overall'] = Math.round(overall * 10) / 10;
            var next = $(this).closest('section').attr('id').replace('1', '2');
            $('#'+next).find('.overall').html(overall);
            window.location.hash = next;
        });
        $('.review_form_2').submit(function(f){
            f.preventDefault();
            revealCare.reviewData['comments'] = $(this).find('.comments').val();
            console.log(revealCare.reviewData);
            var next = $(this).closest('section').attr('id').replace('2', 'thanks');
            window.location.hash = next;
        });
        $('.review_thanks div').click(function(){
            window.location.hash = 'home';
        });
        $('.no_results').click(function(){
            history.back();
        });
        $('#treatment_search_results div').click(function(){
            revealCare.resultsMap($(this).attr('class'));
            window.location.hash = 'search_results_map';
        });
        $('#use_current_loc').click(function(){
            if($(this).is(':checked')){
                $('#expanded_search').hide();
            }
            else{
                $('#expanded_search').show();
            }
        });
        $('#review_physican_results_list .search_results_row').click(function(){
            window.location.hash = 'display_reviews_doctor';
        });
        $(window).on('hashchange', function(){
            console.log(window.location.hash);
            $(window.location.hash).show();
            $(revealCare.currentSection).hide();
            revealCare.currentSection = window.location.hash;
        });
    },

    logout: function(){
        this.loggedIn = false;
        this.setCookie('email', '', -1);
        $('#login_link').attr('class', 'login');
        $('#login_link').html('Login');
        $('#username').html('');

    },

    resultsMap: function(newClass){
        $('#search_results_map').attr('class', newClass);
        $('#search_results_map').css('background', 'url(images/'+newClass+'_search_results.jpg) left no-repeat');
    },

    setCookie: function(name, value, days){
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + days);
        var c_value = escape(value) + ((days == null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie = name + "=" + c_value;
    },

    setMap: function(){
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(this.testInfo.lat, this.testInfo.lng),
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        for (var i in this.testInfo.facilities) {
            this.geocoder.geocode( { 'address': this.testInfo.facilities[i].address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var myLatLng = new google.maps.LatLng(results[0].geometry.location.ob, results[0].geometry.location.pb);
                    //icon: image,zIndex: marker[3]
                    var marker = new google.maps.Marker( {
                        position: myLatLng,
                        map: map,
                        title: revealCare.testInfo.facilities[i].name,
                    });
                     google.maps.event.addListener(marker, 'click', function() {
                        window.location.hash = 'display_reviews_facility';
                    });
                }
            }); 
        }
    },

};

$(document).ready(function(){
    revealCare.init();
});

