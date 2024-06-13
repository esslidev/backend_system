FROM node:20

# Set the working directory inside the container
WORKDIR /backend

# Install Yarn globally using npm
RUN npm install yarn

# Copy package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Run Prisma generate and push commands
RUN yarn run generate

# Expose the necessary port
EXPOSE 4000
