# AWS HealthApp BackEnd

A set of simple PHP scripts to get results in JSON format from AWS DynamoDB

Current PublicDNS = ec2-54-201-100-91.us-west-2.compute.amazonaws.com
Current PublicIP = 54.201.100.91

## To query for Treatment 

	RootURL?Treatment=ID
	
Example:	
	
	RootURL?Treatment=BoneScan
	
## To get details About Doctors and Facilities

	RootURL?About=ID
	
Example:
	
	RootURL?About=RohitKumar
	RootURL?About=MayoClinic

## To get Reviews

	RootURL?Review=ReviewID
	
Example:

	RootURL?Review=Review1
	
Note: Replace RootURL with current PublicDNS or PublicIP