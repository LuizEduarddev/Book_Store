<a id="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/LuizEduarddev/Book_Store">
    <img src="https://www.catconworldwide.com/wp-content/uploads/2018/04/reading-498102.jpg" alt="Logo" width="600" height="300">
  </a>

  <h3 align="center">Book Store Project</h3>

  <p align="center">
    A Book Store integrate with Gemini! 
  </p>
</div>



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Screen_Recording_20241130_161327_ExpoGo-ezgif com-gif-to-mp4-converter](https://github.com/user-attachments/assets/7b2f0e44-dfe8-4ec4-81e5-b328cda93bed)

This project was made for my Python discipline at Roma3!
The idea it's to find the ideal book for everyone and everywhere!
For indecisive people (as me :P) i also have integrated gemini! It can give recommendations
or even if you want to know if some book are available, you can ask it!

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

[![My Skills](https://skillicons.dev/icons?i=py,django,react,ts,posgres&theme=light&perline=1)](https://skillicons.dev)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started


### Prerequisites
To run this project, you may have python and typescript installed.
Also you need to have ngrok (if want to run on your smartphone)

### Installation

1. Open the terminal.
2. Clone the repo
   ```sh
   git clone https://github.com/LuizEduarddev/Book_Store.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Open the terminal at /Projeto_final
   ```sh
   python manage.py runserver <preference_port>
   ```
5. Goes to /client and run
   ```sh
   npx expo start --reset-cache
   ```
6. Open ngrok
   ```sh
   ngrok http <same_port_as_you_put_in_python>
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Now, let's setup mainly database configurations 

1. To create a super user needs to 
   ```sh
   http://localhost:8000/playground/auth/register/staff/
   data needs to send in this format
   formdata = {
    username
    password
   }
   ```
2. To create a user needs to 
   ```sh
   http://localhost:8000/playground/auth/register/
   data needs to send in this format
   formdata = {
    username
    password
   }
   ```
3. And finally, to create a book: 
   ```sh
   localhost:8000/playground/livros/cadastrar/
   data needs to send in this format
   formdata = {
    nomeLivro
    precoLivro
    quantidadeEstoque
    isbn
    categoria: can be [ Ficção Científica Romance Fantasia Biografia Aventura História Mistério Terror Autoajuda Educacional ],
    nomeAutor
    dataLancamento
    fotoLivro
   }
   ```
   

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!
