<?php

// Include the SDK using the Composer autoloader
require "vendor/autoload.php";

use Aws\DynamoDb\DynamoDbClient;
use Aws\DynamoDb\Enum\ComparisonOperator;
use Aws\DynamoDb\Enum\Type;

// Instantiate the client with your AWS credentials
$aws = Aws\Common\Aws::factory('./config.php');
$client = $aws->get("dynamodb");
//$fourteenDaysAgo = date("Y-m-d H:i:s", strtotime("-14 days"));

if (isset($argv))
    $searchKey = $argv[1];
else
    $searchKey = $_GET['searchKey'];

if (!empty($searchKey)){
$response = $client->query(array(
    "TableName" => "Review",
    "KeyConditions" => array(
        "Review ID" => array(
            "ComparisonOperator" => ComparisonOperator::EQ,
            "AttributeValueList" => array(
                array(Type::STRING => (string)trim($searchKey))
            )
        ),
    )	
 ));
}
//print_r ($response['Items']);
echo json_encode($response['Items']);

?>
