# SC2006_T30_CodePart (BACKEND)
## Getting Started with dotnet (would download all the necessary package)
```bash
dotnet restore 
```
```bash
dotnet watch run 
```

## Database (MSSQL)
Connect to DB locally (FROM 7:30):

https://www.youtube.com/watch?v=SIQhe-yt3mA&list=PL82C6-O4XrHfrGOCPmKmwTO7M0avXyQKc&index=4

Whenever made changes to models (schema of db) then run this command:
```bash
dotnet ef migrations add typechangesmade
```
To apply changes to Database / FIRST TIME SET UP JUST RUN THIS DN MIGRATIONS ADD, SUBSEQUENTLY IF GOT CHANGE IN MODELS THEN RUN MIGRATIONS ADD:
```bash
dotnet ef database update
```

## JWT
To store signingkey run this 2 commands:
```bash
dotnet user-secrets init
```

```bash
dotnet user-secrets set "JWT:SigningKey" "SszW2s8rgsqASx4kalAVTj25NEpFesfd"
```

### Change port number
In Poperties/launchSettings.json change the port number to 5073

## Register Endpoint
Would return 500 code for any errors, 200 if user created sucessfully

#### Password Requirements
- Min Length 8
- Require Uppercase
- Require Lowercase
- Requre Digit


