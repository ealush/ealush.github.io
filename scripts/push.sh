git config --global user.email $EMAIL_ADDRESS --replace-all
git config --global user.name ealush

git add .
git commit -m "$(curl -s https://whatthecommit.com/index.txt)"
git push https://$GITHUB_TOKEN@github.com/ealush/ealush.github.io.git master
