CALL sam build
CALL sam package --template-file recruiter_template.yaml --output-template-file recruiter_packaged.yaml --s3-bucket stratocumulus-recruiter-bucket
CALL aws cloudformation deploy --template-file recruiter_packaged.yaml --stack-name recruiter-api --capabilities CAPABILITY_IAM
CALL sam package --template-file candidate_template.yaml --output-template-file candidate_packaged.yaml --s3-bucket stratocumulus-candidate-bucket
CALL aws cloudformation deploy --template-file candidate_packaged.yaml --stack-name candidate-api --capabilities CAPABILITY_IAM