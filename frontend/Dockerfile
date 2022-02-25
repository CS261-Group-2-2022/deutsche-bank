FROM node

# 1) Copy the code into the container
COPY . .

# 2) Build the front-end, placing the static output (html, css, js) in /build/
RUN rm -rf ./build
RUN npm run build

# The output of this command will then be mapped into the volume `static` - served by nginx.
