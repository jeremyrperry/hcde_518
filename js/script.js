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
    currentSection: '#splash_page',
    geocoder: null,
    loggedIn: false,
    mapSet: false,
    searchInfo: [],
    reviewData: [],
    userInfo: [],
    testInfo: {
        'lat': '47.619591',
        'lng': '-122.317837',
        'username': 'hcde518',
        'password': 'blowfish',
        'email': 'hcde518@uw.edu',
        'doctors':{
            'name': 'Sara Smith',
            'hospital': 'UW Medical Center',
        },
        'facilities': {
            0: {
                'name': 'UW Medical Center - $800',
                'address': '1959 NE Pacific St, Seattle, WA 98195',
            },
            1: {
                'name': 'Swedish Medical Center - Ballard - $1200',
                'address': '5300 Tallman Ave NW, Seattle, Washington 98107',
            },
            2: {
                'name': 'Group Health - Capitol Hill - $950',
                'address': '201 16th Ave E, Seattle, WA 98112',
            },
            3: {
                'name': 'Harborview Medical Center - $750',
                'address': '325 9th Ave, Seattle, WA 98104',
            },
        }
    },
    webServiceUrl: 'http://phad.phluant.net',

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
        var username = this.checkCookie('username');
        if(username){
            var html = '<a href="#logout" class="logout_link">Logout</a>';
            $('#user_info').html(html);
            this.loggedIn = true;
            $('.logout_link').unbind('click');
            $('.logout_link').bind('click', function(a){
                a.preventDefault();
                revealCare.logout();
                alert('logging out');
                window.location.hash = 'search';
            });
        }
    },

    exitSplash: function(){
        console.log('in exit splash');
        //$('#city_state').attr('placeholder', this.userInfo.city+', '+this.userInfo.state);
        //$('#zip').attr('placeholder', this.userInfo.zip);
        setTimeout(function(){
            window.location.hash = 'search';
            $('#user_info').show();
            console.log('past hash change');
            $('footer').show();
            
        },3000);
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
        this.geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var googleAddress = results[0].formatted_address.split(',');
                var stateZip = $.trim(googleAddress[2]).split(' ');
                revealCare.userInfo.city = $.trim(googleAddress[1]);
                revealCare.userInfo.state = $.trim(stateZip[0]);
                revealCare.userInfo.zip = $.trim(stateZip[1]);
                 console.log("Google intended address: "+revealCare.userInfo.city+','+revealCare.userInfo.state+','+revealCare.userInfo.zip);
                revealCare.exitSplash();
            }
            else{
                $.get(revealCare.webServiceUrl+'/web_services/geolocation/export?type=city_postal_by_geo&value='+address, function(d){
                    var data = jQuery.parseJSON(d);
                    revealCare.userInfo.city = data.results.city;
                    revealCare.userInfo.state = data.results.state_region;
                    revealCare.userInfo.zip = data.results.postal_code;
                    revealCare.exitSplash();
                });
            }
        });
    },

    init: function(){
        var loc = window.location.href;
        var index = loc.indexOf('#');
        if (index > 0) {
          window.location = loc.substring(0, index);
        }
        this.checkLogin();
        this.geocoder = new google.maps.Geocoder();
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
        $('#login_form').submit(function(f){
            f.preventDefault();
            revealCare.loggedIn = true;
            revealCare.setCookie('username', $('#user_email_login').val(), 14);
            revealCare.checkLogin();
            var dest = $('#redirect_login').val();
            window.location = dest;
        });
        $('.search').click(function(){
            var type = $(this).attr('id').replace('_search', '');
            if(type == 'treatments'){
                $('#treatment_banner').show();
            }
            else{
                $('#treatment_banner').hide();
            }
            $('#search_form').removeAttr('class');
            $('#search_form').addClass(type);
            $('#search').find('#search_field').attr('placeholder', 'Search '+revealCare.capitalize(type));
            window.location.hash = 'search';
        });
        $('#search_form').submit(function(f){
            f.preventDefault();
            var searchType = $(this).attr('class');
            var destSection = 'review_search_map';
            if($('#search_field').val() == 'nada'){
                destSection = 'review_search_no_results';
            }
            if($('#search_field').val() == 'dunno'){
                destSection = 'review_treatment_results_list';
            }
            if($('#search_field').val() == 'radius'){
                destSection = 'review_search_no_radius';
            }
            else{
                if(!revealCare.mapSet){
                    revealCare.setMap();
                    revealCare.mapSet = true;
                }
            }
            //$(this).reset();
            window.location.hash = destSection;
        });
        $('#leave_review').click(function(){
            window.location.hash = 'review_main';
        });
        $('.login_link').bind('click', function(a){
            a.preventDefault();
            if(revealCare.loggedIn){
                alert('You are already logged in.');
                return false;
            }
            else{
                $('#redirect_login').val(window.location.hash);
                window.location = $(this).attr('href');
            }
        });
        $('.reg_link').bind('click', function(a){
            a.preventDefault();
            if(revealCare.loggedIn){
                alert('You are already logged in.');
                return false;
            }
            else{
                $('#redirect_reg').val($('#recirect_login').val());
                window.location = $(this).attr('href');
            }
            
        });
        $('#review_main div').click(function(){
            if(!revealCare.loggedIn){
                $('#redirect_login').val(window.location.hash);
                window.location.hash = 'login';
            }
            else{
                window.location.hash = 'review_submit';
            }
        });
        $('.review_back').click(function(){
            var backTo = $(this).closest('form').attr('id').replace('review_form_', '');
            backTo--;
            $(this).closest('div').hide();
            $('#review_div_'+backTo).show();
        });
        $('#review_form_1').submit(function(f){
            f.preventDefault();
            $(this).find('input[type="text"], input[type="date"]').each(function(){
                revealCare.reviewData[$(this).attr('id')] = $(this).val();
            });
            $('#review_div_2').show();
            $('#review_div_1').hide();
        });
        $('#review_form_2').submit(function(f){
            f.preventDefault();
            $(this).find('input[type="radio"]').each(function(){
                if($(this).attr('checked')){
                    revealCare.reviewData[$(this).attr('name').replace('review_', '')] = $(this).val();
                }
            });
            console.log(revealCare.reviewData);
            for(var i in revealCare.reviewData){
                if(i != 'review_date' || 'review_tq'){
                    console.log(i);
                    $('#review_div_3').find('.'+i).html(revealCare.reviewData[i]);
                }
            }
            $('#review_div_3').show();
            $('#review_div_2').hide();
        });
        $('#review_form_3').submit(function(f){
            f.preventDefault();
            revealCare.reviewData['comments'] = $('#review_comments').val();
            alert('Thank you!');
            window.location.hash = 'search';
           $('#review_div_3').hide();
           $('#review_div_1').show();
           $('#review_form_1').reset();
           $('#review_form_2').reset();
           $(this).reset();
        });
        $('.no_results').click(function(){
            history.back();
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
            $(window.location.hash).show();
            $(revealCare.currentSection).hide();
            revealCare.currentSection = window.location.hash;
        });
    },

    logout: function(){
        this.loggedIn = false;
        this.setCookie('username', '', -1);
        var html = '<a href="#login" class="login_link">Login</a>';
        $('#user_info').html(html);
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

