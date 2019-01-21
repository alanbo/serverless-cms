#!/bin/bash
cd back_end/;
npm install;
npx sls deploy;

SLS_DEPLOY=$?
if [ $SLS_DEPLOY -eq 0 ]; then
  echo "Successfully deployed slscms stack."
  cd ../admin/;
  npm install;
  npm run build;

  ADMIN_BUILD=$?
else
  echo "Failed to deploy slscms stack."
  cd ..;
  exit $SLS_DEPLOY;
fi

if [ $ADMIN_BUILD -eq 0 ]; then
  echo "Successfully built admin dashboard."
  cd ../back_end/;
  mv ../admin/build/index.html ../admin/build/index;
  npx sls s3sync;
  UPLOAD=$?
else
  echo "Failed to build admin dashboard."
  cd ..;
  exit $ADMIN_BUILD;
fi

if [ $UPLOAD -eq 0 ]; then
  echo "Successfully uploaded assets"
  cd ..;
else
  echo "Failed to upload assets"
  cd ..;
  exit $UPLOAD;
fi

cat website-url.txt
