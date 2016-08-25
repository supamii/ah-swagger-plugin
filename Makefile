# @Author: Guan Gui <guiguan>
# @Date:   2016-08-24T00:06:21+10:00
# @Email:  root@guiguan.net
# @Last modified by:   guiguan
# @Last modified time: 2016-08-26T07:51:31+10:00



# TODO fix relative path in src/index.html
all:
	rm -rf public/swagger
	mkdir -p public/swagger
	cp -R angular-swagger-ui-material/dist/* public/swagger
