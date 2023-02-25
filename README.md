# Web Scraper

This is a simple web scraper that scrapes a website and saves the data to a SQLite database. It uses Node.js and the Cheerio library for scraping the website, and the sqlite3 library for working with the database.

## Installation

To install the necessary packages, run the following command:

## Usage

To run the scraper, use the following command:

This will scrape the website and save the data to a SQLite database. If the database file does not exist, it will be created.

## Project Structure

- `scraper/scraper.js` - Contains the function for scraping the website.
- `database/createDB.js` - Contains the function for creating the SQLite database.
- `database/database.js` - Contains the functions for working with the SQLite database.
- `index.js` - The main file that runs the scraper and saves the data to the database.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
