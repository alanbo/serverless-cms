# Serverless CMS
Serverless CMS is a simple, one-command deploy/update cms system for websites, that has nearly infinite scalability out of the box. It uses AWS Serverless architecture to render html files to Amazon S3. This way you can host high-traffic websites at a very low cost and with high reliability. 

It's built with front-end developers in mind. Instead of adjusting your front-end code to match the CMS requirements (ie. Drupal, Wordpress), specify with graphql what data you want to get and render it in your templates. For now it supports pug templating engine - there are plans to support handlebars and many more. 

For now, it is very much still a work in progress. It works, you can already run websites on it but it needs lots of fixes and improvements.

The following documentation assumes basic knowledge of Amazon Web Services:


## Getting Started
Assuming that you have an AWS account and node.js set up on your Linux/Mac computer:

1. Copy the repository to your folder.
2. Edit ```slscms-config.yml``` file with your service name and the target bucket name (needs to be unique).
3. Run ```./slscms-init.sh``` bash script in the root directory.
4. Go to amazon cognito in your aws console and create the first user. Add the user to dataEditor group. 
5. Go to the bucket's website address adding ```/admin``` route. You can find the url in the ```website-url.txt``` file in the root directory or in the bash script output.
6. Log in and start editing.
7. Create a page named ```index``` to get a homepage in the root url.

It is advisible to set up ssl for the website. More information here: https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-https-requests-s3/

## Front End Development
- Each page type has its graphql query and the result of this query is going to be rendered with pug template specified in ```front_end/config/pages.json``` file. You can add your own page types, mixing and matching the types specified in ```back_end/settings/graphql-api/schema.graphql```. Any type that implements ```Fragment``` interface can be used.
- Any file/folder that you put in ```front_end/public/``` folder will be copied over to the ```dist/``` folder in the root of the bucket. The pages specified in your templates will be rendered in the root of the bucket. 
- Any image file uploaded in the gallery will be resized to 4 different formats based on ```back_end/functions/resize-images/settings.js``` file.
- To update your front-end assets run ```slscms-upload.sh``` bash script. 

## Extending CMS
- You can add any type in ```back_end/settings/graphql-api/schema.graphql```. As long as it implements ```Fragments``` interface queries, mutations and resolvers for it will be automatically provisioned.
- You can add your own editors in the admin dashboard or replace existing ones. Edit ```admin/src/components/inputs/input-config.tsx``` file and follow the conventions established in it. 

## Roadmap
- organising and unifying configuration files.
- adding unit tests and integration tests.
- adding admin dashboard styling for mobile devices and large screens.
- adding spinners for any async operations in the admin dashboard.
- putting input components into separate repositories and creating npm modules for them.
- adding scheduled lambda function that cleans stray image files in s3.
- adding extensible, plugin based settings section.
- cleaning up aws roles with a principle of the least privilege in mind. 
- creating more user friendly version of pages section in the admin dashboard. 
- improving gallery creation when AWS introduces DynamodDB Transactions to AppSync
- creating docker image and option for windows users to easily deploy the CMS.
- adding multi-user environment to the admin dashboard - different privileges based on different roles.
- adding staging bucket to test the website before rendering to the production website.
- adding backup option in the admin dashboard.
