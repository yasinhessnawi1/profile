import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Yasin Hessnawi",
  initials: "YH",
  url: "http://localhost:3000",
  location: "Gjøvik, Norway",
  locationLink: "https://www.google.com/maps/place/Gjøvik",
  description:
    "A 2025 graduate from the Software Engineering Bachelor’s program at NTNU Gjøvik.",
  summary:
    "Yasin, a 2025 graduate from the Software Engineering Bachelor’s program at NTNU Gjøvik, is passionate about programming and building digital solutions. With experience in front-end and back-end development, data processing, and AI, Yasin enjoys tackling challenging problems and is committed to continuous learning. Having worked as a student teacher, Yasin has a strong foundation in both technical and communication skills, emphasizing professionalism and goal-oriented teamwork. Eager to take on dynamic consulting projects and contribute to a driven team environment.",
  avatarUrl: "/me.JPG",
  skills: [
    "javascript",
    "java",
    "javafx",
    "python",
    "c",
    "c++",
    "Go/Golang",
    "MicrosoftAzure",
    "Scrum",
    "sql",
    "nosql",
    "mongodb",
    "mariaDB",
    "postgresql",
    "react",
    "android",
    "html5",
    "css3",
    "node.js",
    "amazonaws",
    "firebase",
    "nginx",
    "linux",
    "docker",
    "git",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "yasinhessnawi1@gmail.com",
    tel: "+4794972907",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/yasinhessnawi1",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/yasin-hessnawi-102a02326",
        icon: Icons.linkedin,

        navbar: true,
      },
    },
  },

  work: [
    {
      company: "FRK. LOVISE",
      href: "https://atomic.finance",
      badges: [],
      location: "Sandnessjøen",
      title: "BARISTA",
      logoUrl: "/frk-lovise.png",
      start: "July 2021",
      end: "Sept 2023",
      description:
        "• creating and designing of menus for the cafe\n" +
          "• opening activities within the cafe(preparations for service) " +
          "• preparation of food and cold as well as hot drinks\n" +
          "• area cleaning\n" +
          "• janitorial activities (garden and structural maintenance)\n" +
          "• management of register\n" +
          "• development of a budgeting and accounting desktop application to assist the cafe with their financial activities (part of university course)",
    },
    {
    company: "NORGES TEKNISK-NATURVITENSKAPELIGE UNIVERSITET",
    href: "https://www.ntnu.no/",
    badges: [],
    location: "Gjøvik",
    title: "STUDENT ASSISTANT ",
    logoUrl: "/ntnu.svg",
    start: "Jan 2024",
    end: "June 2024",
    description:
"• aiding students in understanding the taught content" +
"• supporting students in their class projects" +
"• supplying students with practice questions for examination " +
"  • correction of class projects and assignments" +
"• assessing students knowledge levels and assisting them in reaching the demanded standards",
},
    {
company: "NORGES TEKNISK-NATURVITENSKAPELIGE UNIVERSITET",
    href: "https://www.ntnu.no/",
    badges: [],
    location: "Gjøvik",
    title: "UNIVERSITY TEACHING ASSISTANT",
    logoUrl: "/ntnu.svg",
    start: "Aug 2024",
    end: "Des 2024",
    description:
"• preparation and operation of labs for students" +
"  • assisting students with understanding the content of lectures " +
        "• correcting and grading students' academic work" +
"• preparing students for examination ",
},
    {
      company: "NORGES TEKNISK-NATURVITENSKAPELIGE UNIVERSITET",
    href: " https://i.ntnu.no/wiki/-/wiki/Norsk/LAOS+-+Opplæring+for+læringsassistenter",
    badges: [],
    location: "Gjøvik",
    title: "LAOS Teaching Assistant Certificate",
    logoUrl: "/ntnu.svg",
    start: "Aug 2024",
    end: "Des 2024",
    description:
"• educated on creating safe, communicative and constructive environments " + "• learned principles of conflict resolution" +
"• learned how to asses levels of understanding and provide ideal guidance",
},
  ],
  education: [
    {
      school: "Sandnessjøen VGS",
      href: "https://sandnessjoen.vgs.no",
      degree: "VITNEMÅL, QF level 4",
      logoUrl: "/vgs.png",
      start: "aug 2019",
      end: "june 2022",
    },
    {
      school: " Norges teknisk-naturvitenskapelige universitet",
      href: " https://www.ntnu.no",
      degree: "BACHELOR IN COMPUTER SCIENCE,  EQF level 6",
      logoUrl: "/ntnu.svg",
      start: "aug 2022",
      end: "june 2025",
    },

  ],

  projects: [
    {
      title: "SmartHus As (Basic Java)",
      href: "https://github.com/yasinhessnawi1/SmartHus",
      dates: "sep 2022 - nov 2022",
      active: true,
      description:" Developed a basic Java program to manage a storage of items, featuring functionalities to add, remove, list, and search items through a user-interactive Cli menu. (Programming 1 course exam)(JAVA)\n",
      technologies: [
        "JAVA",
      ],
      links: [
        {
          type: "Repository",
          href: "https://github.com/yasinhessnawi1/SmartHus",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/java-project.png",
      video: "",
    },
    {
      title: "Frk. Economy",
      href: "https://gitlab.com/yasin2462145/frk-economy",
      dates: "feb 2023 - mai 2024",
      active: true,
      description:"Developed a desktop application for budgeting and accounting aimed at small businesses, providing control over transactions with features like detailed income and expense tracking, graphical reports, and budget management. The application includes multiple pages for transaction overviews, budget insights, and comprehensive financial reports. The project is currently under development, focusing on further testing and refinement.\n",
      technologies: [
        "JAVA",
        "JAVAFX",
      ],
      links: [
        {
          type: "Repository",
          href: "https://gitlab.com/yasin2462145/frk-economy",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "/frk.mov",
    },
    {
      title: "RiddleBoundRampage",
      href: "https://github.com/yasinhessnawi1/RiddleBoundRampage",
      dates: "feb 2023 - mai 2024",
      active: true,
      description:"Co-created an interactive path-based adventure game featuring customisable stories, riddles, and dynamic gameplay where players solve puzzles while being chased by a zombie monster. The game offers a variety of play modes, including story creation and competitive challenges, with customisable goals and character settings for a personalised experience. Development is ongoing, with plans for future enhancements.\n",
      technologies: [
        "JAVA",
        "JAVAFX",

      ],
      links: [
        {
          type: "Repository",
          href: "https://github.com/yasinhessnawi1/RiddleBoundRampage",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "/riddle.mov",
    },
    {
      title: "ElectroMart",
      href: "https://github.com/yasinhessnawi1/elektromart-server",
      dates: "feb 2023 - mai 2024",
      active: true,
      description: "Developed a full-stack e-commerce platform for electronics using React (as a new beginner) for the front-end and a RESTful API built with Golang for the back-end. Implemented core features like product categorisation, detailed product views, cart management, and checkout. Utilised MySQL for database management and integrated various tools like GORM, Gin-Gonic, and GoDotEnv for efficient and scalable backend operations.",
      technologies: [
        "Go/Golang",
        "React",
          "Html5",
          "css3",
          "component-css",
          "MariaDB",
          "Heroku",
           "Gin-Gonic",

      ],
      links: [
        {
          type: "Backend",
          href: "https://github.com/yasinhessnawi1/elektromart-server",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Frontend",
          href: "https://github.com/yasinhessnawi1/ElectroMart",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/electromart.png",
      video: "",
    },
  ],

} as const;
