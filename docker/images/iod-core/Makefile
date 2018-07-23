.PHONY: all image compile clean
all: clean image

clean:
	rm -rf ./iod-core*.tgz

compile:
	cd ../../../ && npm install && npm run build-for-image && npm pack
	cp ../../../iod-core*.tgz ./

image: compile
	docker build -t iod/core . 