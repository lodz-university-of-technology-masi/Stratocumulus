CALL sam build
CALL sam package --template-file candidate_template.yaml --output-template-file candidate_packaged.yaml --s3-bucket stratocumulus-lambdas-bucket
CALL aws cloudformation deploy --template-file candidate_packaged.yaml --stack-name candidate-api --capabilities CAPABILITY_IAM