# restaurant_sidechain
Sidechain restaurant business based on Lisk blockchain

How to configure
setup a host machine with Ubuntu 18.04
commands: 

/*install python minimal*/
sudo apt update
sudo apt install -y libtool automake autoconf curl build-essential python-minimal

/*if you don't have docker installed yet*/
sudo apt-get install docker.io
/*setup a postgres instance for lisk db running on port 5435*/
sudo docker run --name restaurant_sidechain -p5435:5432 -e POSTGRES_USER=lisk -e POSTGRES_PASSWORD=lisk -e POSTGRES_DB=lisk_dev -d postgres:10

/*create a lisk user and login into it*/
sudo adduser lisk

/*install nvm. After installing it logout from lisk user and login with lisk user*/
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

/*run*/
nvm install 10.15.3

/*install pm2*/
npm install -g pm2

/*clone restaurant_sidechain repository*/
git clone https://github.com/davilinfo/confisaic_2020.git

/*run npm ci from inside restaurant_sidechain folder*/
npm ci

/*verify index.js file if it suits your needs and run the sidechain. By default delegates run inside unique node with attribute force = true. Run*/ node index.js

/*If it runs, enabled forging and started to forge blocks then congratulations! You are running a lisk sidechain.*/
/*Now stop it and let's configure it to run with pm2*/
pm2 start --name restaurant_sidechain index.js

/*to verify the log follow below. 0 refers to the id on pm2*/
pm2 logs 0

/*pm2 --help for other commands*/

/*access dish_commands folder read the readme.txt file and then run the commands each command once*/

Now move to the backend folder to configure the backend. Open the Readme there
