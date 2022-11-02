# UI for Alexandria
Back-end can be found [here](https://github.com/anirban-a/alexandria).

Front-end can be viewed on XAMPP. To create a local deployment of it, follow these instructions:

1. Download XAMPP for your OS from [Apache Friends](https://www.apachefriends.org/index.html).

2. Follow the corresponding instructions. If prompted, select an empty folder to install XAMPP in.

3. Clone this repository into `<path of XAMPP>/htdocs` folder.

4. Add
```
ui:
  port: 3000
```
to the bottom of `application-local.yml` file from the back-end.

5. Open a shell from the XAMPP Control Panel. 

6. From that shell, navigate to `<path of XAMPP>/htdocs/<repository name>` and enter in `php -S localhost:3000`.

7. To view the pages, enter in `http://localhost:3000` into your browser.