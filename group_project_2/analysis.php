<?php

function percentage($val, $total){
	return round(($val/$total)*100).'%';
}

require_once('../init.php');
$cq = $db->query("select count(cost_care_factor) as care from group_assignment_2 where cost_care_factor = 'Yes'");
$cr = $cq->fetch_assoc();
$care = $cr['care'];

echo '<p>Answered yes to cost is important: '.$care.'</p>';
$aq = $db->query("select count(out_of_pocket_awareness) as aware from group_assignment_2 where cost_care_factor = 'Yes' and out_of_pocket_awareness = 'Yes'");
$ar = $aq->fetch_assoc();
$aware = $ar['aware'];

echo '<p>Also said they\'re aware of their out of pocket costs: '.$aware.'<br />';
echo 'Percentage: '.percentage($aware, $care).'</p>';

$uq = $db->query("select count(using_current_methods) as `using` from group_assignment_2 where cost_care_factor = 'Yes' and using_current_methods = 'Yes'");
$ur = $uq->fetch_assoc();
$using = $ur['using'];

echo '<p>Also said they\'re using current methods or services to keep track of their healthcare expenses: '.$using.'<br />';
echo 'Percentage: '.percentage($using, $care).'</p>';


$ncmq = $db->query("select count(*) as method from group_assignment_2 where using_current_methods = 'No'");
$ncmr = $ncmq->fetch_assoc();
$method = $ncmr['method'];
echo '<p>Answered no to \'Are you currently using or aware of any methods or services to keep track of your healthcare?\': '.$method.'</p>';

$mcq = $db->query("select count(*) as correlation from group_assignment_2 where using_current_methods = 'No' and interest_in_app = 'Yes'");
$mcr = $mcq->fetch_assoc();
$correlation1 = $mcr['correlation'];
echo '<p>Also answered yes to interest in application: '.$correlation1.'<br />';
echo 'Percentage: '.percentage($correlation1, $method).'</p>';

$ncaq = $db->query("select count(*) as awareness from group_assignment_2 where out_of_pocket_awareness = 'No'");
$ncar = $ncaq->fetch_assoc();
$awareness = $ncar['awareness'];
echo '<p>Answered no to \'Are you currently using or aware of any methods or services to keep track of your healthcare?\': '.$awareness.'</p>';

$naq = $db->query("select count(*) as correlation from group_assignment_2 where out_of_pocket_awareness = 'No' and interest_in_app = 'Yes'");
$nar = $naq->fetch_assoc();
$correlation2 = $nar['correlation'];
echo '<p>Also answered yes to interest in application: '.$correlation2.'<br />';
echo 'Percentage: '.percentage($correlation2, $awareness).'</p>';



