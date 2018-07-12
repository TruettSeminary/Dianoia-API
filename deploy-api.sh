rm -rf ~/old-deploy/Dianoia-API

mv ~/Dianoia-API ~/old-deploy

cd ~ && git clone https://github.com/TruettSeminary/Dianoia-API.git/

mkdir ~/Dianoia-API/config/environments

cp -R ~/config/environments/* ~/Dianoia-API/config/environments/

cd ~/Dianoia-API && npm install --production

NODE_ENV=production pm2 restart api