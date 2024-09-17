# AquaPong Website 🏓
Welcome to the AquaPong world! Here 🚀 , users can play single games of pingpong 🏓, take part in tournaments, and hone their skills while connecting with other users and tracking their progress and achievements 🏅.

# Index
1. [ Usage ](#usage)
2. [ Technologies Used ](#tech)
3. [ Conception ](#cons)
4. [ File Structure](#file)
5. [ Models ](#mode)
6. [ Preview ](#prev)
7. [ Ressources ](#ress)

<a name="usage"></a>
# Usage
![Command Usage](assets/Usage.png)
You should first modify .env.example and rename it to .env !!

<a name="tech"></a>
# Technologies Used
<table class="steelBlueCols">
<thead>
<tr>
<th width=400 height=50>Part</th>
<th width=400 height=50 >Technology</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>FrontEnd</b></td>
<td><a href="https://react.dev/" style="text-decoration:none;"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" height=50 widht=60 > </a>
    <a href="https://tailwindui.com/" style="text-decoration:none;"> <img src="https://tailwindui.com/favicon.ico" alt="tailwind" height=60 > </a> 
    <a href="https://nextjs.org/" style="text-decoration:none;"> <img src="https://images.ctfassets.net/23aumh6u8s0i/6pjUKboBuFLvCKkE3esaFA/5f2101d6d2add5c615db5e98a553fc44/nextjs.jpeg" alt="next/js" height=60 > </a>
    <a href="https://threejs.org/" style="text-decoration:none;"> <img src="https://innostax.com/wp-content/uploads/2023/09/three-js.jpg" alt="next/js" height=60 > </a>
</td>
</tr>
<tr>
<td><b>Server</b></td>
<td> <a href="https://nginx.org/en/"> <img src="https://nginx.org/favicon.ico"> </a> </td>
</tr>
<tr>
<td><b>Containerization</b></td>
<td><a href="https://www.docker.com/"><img src="https://www.docker.com/wp-content/uploads/2024/07/4.33-nav-promo_docker-desktop-release.svg" alt="Docker" height=60></a></td>
</tr>
<tr>
<td><b>BackEnd Frameworks</b></td>
<td>
    <a href="https://www.djangoproject.com/"><img src="https://static.djangoproject.com/img/logos/django-logo-negative.png" alt="Django" height=60 ></a>
    <a href="https://www.django-rest-framework.org/"><img src="https://www.django-rest-framework.org/img/logo.png" alt="DjangoRestFramework" height=60 ></a>
</td>
</tr>
<tr>
<td><b>Languages</b></td>
<td>
    <a herf="https://developer.mozilla.org/en-US/docs/Web/HTML"><img src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" alt="HTML" height="60"></a>
    <a herf="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" alt="CSS" height="60"></a>
    <a herf="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JS" height="60"></a>
    <a herf="https://www.python.org/psf-landing/"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Python_logo_01.svg" alt="Python" height="60"></a>
</td>
</tr>
<tr>
<td>Design</td>
<td> <a herf="https://www.figma.com/"><img src="https://cdn.worldvectorlogo.com/logos/figma-5.svg" alt="figma" height="40"></a></td>
</tr>
</tbody>
</table>

<a name="cons"></a>
# Conception

<a name="mode"></a>
# Models

<a name="prev"></a>
# Preview
<h4>LandingPage</h4>

![Command LandingPage](assets/LandingPage.png)
<h4>SignUp</h4>

![Command SignUp](assets/SignUp.png)
<h4>SignIn</h4>

![Command SignIn](assets/SignIn.png)
<h4>Settings</h4>

![Command Settings](assets/Settings.png)
<h4>Two Factor Auth</h4>

![Command 2FA](assets/2FA.png)
<h4>Dashboard</h4>

![Command Search](assets/Search.png)
<h4>Profile</h4>

![Command Profile](assets/Profile.png)
<h4>PrivateChat</h4>

![Command PrivateChat](assets/PrivateChat.png)
<h4>View Profile</h4>

![Command ViewProfile](assets/ViewProfile.png)
<h4>Join Clan</h4>

![Command ClanJoin](assets/ClanJoin.png)
<h4>Map</h4>

![Command Map](assets/Map.png)
<h4>Solo Match</h4>

![Command soloMatch](assets/soloMatch.png)
<h4>Tournament</h4>

![Command Tournament](assets/Tournament.png)
<h4>3D Game</h4>

![Command Game](assets/Game.png)

<a name="file"></a>
# File Structure
```bash
django_backend
│   ├── Dashboard_home
│   ├── Sign_up
│   ├── chat
│   ├── django_backend
│   ├── groups
│   ├── notification
│   ├── playground
frontend
│   ├── app
│   │   ├── (firstSide)
│   │   │   │   ├── signIn
│   │   │   │   ├── signUp
│   │   │   ├── landingPage
│   │   ├── (playground)
│   │   │   ├── playground
│   │   │   ├── privateGame
│   │   │   ├── tournament
│   │   ├── (scondSide)
│   │   │   ├── chatPage
│   │   │   ├── clanPage
│   │   │   ├── gamePage
│   │   │   ├── homePage
│   │   │   │   ├── [id]
│   │   │   ├── setPassword
│   │   │   ├── settingsPage
│   │   ├── ErrorPage
│   │   ├── api
│   │   ├── assets
│   │   ├── callback
│   │   ├── chat
│   │   ├── components
│   │   ├── contexts
│   │   ├── globalchat
│   │   ├── group_chat
│   │   ├── styles
│   │   ├── utils
│   ├── public
│   │   ├── clans
│   │   ├── gameElement
│   │   ├── maps
│   │   ├── ranks
│   │   ├── soundEffect
```

<a name="ress"></a>
# Ressources

https://nextjs.org/

https://codevoweb.com/django-implement-2fa-two-factor-authentication/

https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/#When-to-Use-Refresh-Tokens

https://www.django-rest-framework.org/api-guide/authentication/
