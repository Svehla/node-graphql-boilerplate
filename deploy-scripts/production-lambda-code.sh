# helper sh script to replace source code without recalling whole terraform and change the terraform state

zip -r -j serverless_admin_index-output.zip dist/serverless_admin_index/index.js dist/serverless_admin_index/.env
zip -r -j serverless_iterator_index-output.zip dist/serverless_iterator_index/index.js dist/serverless_iterator_index/.env


aws lambda update-function-code \
    --function-name ngb_production_admin_service \
    --region eu-central-1 \
    --zip-file fileb://serverless_admin_index-output.zip

aws lambda update-function-code \
    --function-name ngb_production_iterator_service \
    --region eu-central-1 \
    --zip-file fileb://serverless_iterator_index-output.zip

rm serverless_admin_index-output.zip
rm serverless_iterator_index-output.zip


