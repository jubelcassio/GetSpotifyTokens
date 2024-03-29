## Usage

1. Serve the redirect_page on localhost:8000  
```cd redirect_page```  
```python -m http.server```

2. Open a new terminal at the project folder, execute the "authURL" script  
``` node authURL.js```
3. Access the URL generated by the auth.js script
4. Click on the 'Get Code' button
5. The code will be copied to your clipboard. If not, you can get him from the textarea
7. Paste the code into the terminal input

8. Execute "token.js" script  
``` node token.js```

9. Test the credentials by running "test.js", it should output your spotify's username  
``` node test.js ```

10. Your credentials are now saved into the "setup.json" file
11. You may now finish the python server (Ctrl+C) and close the terminals

## Playground
The playground function has a script that demonstrate a simple implementation. 
It logs information about the 5 most recently played tracks from your spotify playlist.
To execute it run the commands described above, followed by:  
``` node playground/recently_songs.js ```

## Warning
Be careful when using your credentials, try to follow security practices when using this script and DO NOT ALLOW your clientSecret, access or refresh tokens or any other sensitive information to be exposed to unkown people.