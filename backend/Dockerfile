FROM node:20-alpine
WORKDIR /app

# 1. Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# 2. Copy the rest of the application files
COPY . .

# 3. Expose the port your backend listens on
EXPOSE 3004

# 4. Fix line endings and permissions for the CORRECT script
# (Assuming your script is actually called backendrun.sh)
RUN sed -i 's/\r$//' backendrun.sh && chmod +x backendrun.sh

# 5. Start the application
CMD ["./backendrun.sh"]
