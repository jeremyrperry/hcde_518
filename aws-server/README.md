# AWS HealthApp BackEnd

A set of simple PHP scripts to get results in JSON format from AWS DynamoDB

Current PublicDNS = http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com

Current PublicIP = http://54.201.100.91

## To query for Treatment
	
Example:
http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com/aws-server/Treatment.php?searchKey=Bone%20Scan
	
## To get details About Doctors and Facilities
	
Example:

Facility:
http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com/aws-server/About.php?searchKey=Mayo%20Clinic

Doctor:
http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com/aws-server/About.php?searchKey=Rohit%20Kumar

## To get Reviews
	
Example:
http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com/aws-server/Review.php?searchKey=Review1

## TO add Reviews

Example:
http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com/aws-server/AddReview.php?to=Ben%20Kim&from=User1&value=3&quality=4&cost=4&review=he%20is%20good