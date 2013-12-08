<?php

// Include the SDK using the Composer autoloader
require "vendor/autoload.php";

use Aws\DynamoDb\DynamoDbClient;
use Aws\DynamoDb\Enum\ComparisonOperator;
use Aws\DynamoDb\Enum\Type;

// Instantiate the client with your AWS credentials
$aws = Aws\Common\Aws::factory('./config.php');
$client = $aws->get("dynamodb");

$response = $client->scan(array(
    "TableName" => "Doctor-Facility",
	"AttributesToGet" => array("ID"),
        "ScanFilter" => array(
                "Type" => array(
                        "ComparisonOperator" => ComparisonOperator::EQ,
                        "AttributeValueList" => array(
                                array( Type::STRING => "D" )
                        )
                ),
        )
));

    for ($ctr=0; $ctr<count($response['Items']); $ctr++)
    {
        //$names[(string)$ctr] = array( "label" => $response['Items'][(string)$ctr]['ID']['S']);
        $names[(string)$ctr] = $response['Items'][(string)$ctr]['ID']['S'];
    
    }
    //print_r ($names);
    echo json_encode($names);

?>
