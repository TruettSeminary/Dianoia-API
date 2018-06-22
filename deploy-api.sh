mv ~/Dianoia-API ~/old-deploy

cd ~ && git clone https://github.com/TruettSeminary/Dianoia-API.git/
  
cp -R ~/config/environments/* ~/Dianoia-API/config/environments/

cd ~/Dianoia-API && npm install --production

NODE_ENV=production pm2 restart api