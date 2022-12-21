FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app
EXPOSE 8080

# copy .csproj and restore as distinct layer
## this command will take all in our system for reactivities and copy it to /app WORKDIR which is in Docker image
COPY "Reactivities.sln" "Reactivities.sln"
COPY "API/API.csproj" "API/API.csproj"
COPY "Application/Application.csproj" "Application/Application.csproj"
COPY "Persistance/Persistance.csproj" "Persistance/Persistance.csproj"
COPY "Domain/Domain.csproj" "Domain/Domain.csproj"
COPY "Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"

RUN dotnet restore "Reactivities.sln"

# copy everythiing else and build
COPY . .
WORKDIR /app
# run publish to create a build version of our application
RUN dotnet publish -c Release -o out

# build a runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "API.dll"]