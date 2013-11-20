# AWS HealthApp BackEnd

A set of simple PHP scripts to get results in JSON format from AWS DynamoDB

Current PublicDNS = http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com

Current PublicIP = http://54.201.100.91

## To query for Treatment
	
Example:
http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com/aws-server/Treatment.php?searchKey=BoneScan
	
## To get details About Doctors and Facilities
	
Example:

Facility:
http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com/aws-server/About.php?searchKey=MayoClinic

Doctor:
http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com/aws-server/About.php?searchKey=RohitKumar

## To get Reviews
	
Example:
http://ec2-54-201-100-91.us-west-2.compute.amazonaws.com/aws-server/Review.php?searchKey=Review1
