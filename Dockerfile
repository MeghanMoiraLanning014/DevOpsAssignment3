FROM node:18-alpine
# Install build tools for native dependencies (bcrypt, kerberos)
RUN apk add --no-cache python3 make g++ krb5-dev
WORKDIR /app
# Copy package files
COPY package*.json ./
# Clean npm cache
RUN npm cache clean --force
# Install dependencies
RUN npm install --legacy-peer-deps
# Install next with legacy peer deps to bypass conflict
RUN npm install next@15.2.4 --legacy-peer-deps
# Verify next installation
RUN npx next --version
# Copy all files
COPY . .
# Build the app
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
