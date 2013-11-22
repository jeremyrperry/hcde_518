<?php

// Include the SDK using the Composer autoloader
require "vendor/autoload.php";

use Aws\DynamoDb\DynamoDbClient;
use Aws\DynamoDb\Enum\ComparisonOperator;
use Aws\DynamoDb\Enum\Type;
use Aws\DynamoDb\Enum\AttributeAction;

// Instantiate the client with your AWS credentials
$aws = Aws\Common\Aws::factory('./config.php');
$client = $aws->get("dynamodb");

$tableReview = "Review";
$tableDocFac = "Doctor-Facility";

if(isset($argv)){
    	$from = $argv[1];
    	$to = $argv[2];
	$cost =  $argv[3];
	$quality =  $argv[4];
	$value =  $argv[5];
	$review =  $argv[6];

}
else{
	$from = $_GET['from'];
    	$to = $_GET['to'];
    	$cost = $_GET['cost'];
	$quality = $_GET['quality'];
	$value = $_GET['value'];
	$review = $_GET['review'];
}

if(!empty($review) && !empty($quality) && !empty($cost) && !empty($value) && !empty($to) && !empty($from))
{

$response = $client->scan(array(
    "TableName" => $tableReview
));

$ctr = 1;
foreach($response['Items'] as $key => $tempValue){
    $ctr++;
}
$reviewID = "Review".$ctr;

$response = $client->query(array(
    "TableName" => "Doctor-Facility",
    "KeyConditions" => array(
        "ID" => array(
            "ComparisonOperator" => ComparisonOperator::EQ,
            "AttributeValueList" => array(
                array(Type::STRING => (string)trim($to))
            )
	),
    )	
 ));

$toRecord = ($response['Items']);
$reviewArr = $toRecord['0']['Reviews']['SS'];
$reviewArr[(string)count($toRecord['0']['Reviews']['SS'])] = $reviewID;
$toRecord['0']['Reviews']['SS'] = $reviewArr;
//print_r ($toRecord);


$response = $client->batchWriteItem(array(
    "RequestItems" => array(
        $tableReview => array(
            array(
                "PutRequest" => array(
                    "Item" => array(
                        "Review ID"      => array(Type::STRING => trim((string)$reviewID)),
                        "Cost"           => array(Type::NUMBER => (integer)trim((string)$cost)),
                        "Quality"        => array(Type::NUMBER => (integer)trim((string)$quality)),
                        "Value"          => array(Type::NUMBER => (integer)trim((string)$value)),
                        "Review"         => array(Type::STRING => trim((string)$review)),
			"From"           => array(Type::STRING => trim((string)$from))
                    )
                ),
            )
	),
	
                            
	)
));


$response = $client->updateItem(array(
    "TableName" => $tableDocFac,
        "Key" => array(
            "ID" => array(
                Type::STRING => $to
            )
        ),
        "AttributeUpdates" => array(
            "Reviews" => array(
                "Action" => AttributeAction::PUT,
                "Value" => array(
                    Type::STRING_SET => $toRecord['0']['Reviews']['SS']
                )
            )        
	)
));

}


//print_r ($response['Items']);
//echo json_encode($response['Items']);

?>
