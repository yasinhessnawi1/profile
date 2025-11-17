import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Yasin Hessnawi",
  initials: "YH",
  url: "http://localhost:3000",
  location: "Gjøvik, Norway",
  locationLink: "https://www.google.com/maps/place/Gjøvik",
  description:
    "A 2025 graduate from the Software Engineering Bachelor's program at NTNU Gjøvik, currently pursuing a Master's in Artificial Intelligence. Co-founder of Safe Media AI AS.",
  summary:
    "Yasin, a 2025 graduate from the Software Engineering Bachelor's program at NTNU Gjøvik with a grade A thesis and Eurika Prize, is currently pursuing a Master's in Artificial Intelligence. Passionate about programming and building digital solutions, Yasin co-founded Safe Media AI AS and leads the development of Declassifai, a web application for detecting and redacting sensitive documents in PDFs. With experience in fullstack development, data processing, cybersecurity, application/system development, cloud computing/devops, infrastructure as code and AI/ML, Yasin enjoys tackling challenging problems and is committed to continuous learning. Having worked as a teaching assistant, Yasin has a strong foundation in both technical and communication skills, emphasizing professionalism and goal-oriented teamwork. Eager to take on dynamic consulting projects and contribute to a driven team environment.",
  avatarUrl: "/me.JPG",
  skills: [
    "javascript",
    "terraform",
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
    { href: "/blog", icon: NotebookIcon, label: "Skills & Blog" },
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
      company: "Safe Media AI AS",
      href: "https://safemediai.com/no",
      badges: [],
      location: "Norway",
      title: "CO-FOUNDER",
      logoUrl: "https://safemediai.com/favicon.ico",
      start: "Aug 2025",
      end: "Present",
      description:
        "• Co-founded Safe Media AI AS, a company specializing in AI-powered document security solutions" +
        "• Leading the development and deployment of Declassifai, a web application for detecting and redacting sensitive documents in PDFs" +
        "• Responsible for strategic direction and product development",
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
      school: "University of Agder",
      href: "https://www.uia.no",
      degree: "MASTER IN ARTIFICIAL INTELLIGENCE",
      logoUrl: "https://www.uia.no/om-uia/designmanual/logoer/uia-horisontal-uten-navn-positiv.png",
      start: "Aug 2025",
      end: "June 2027",
    },
    {
      school: "Norges teknisk-naturvitenskapelige universitet",
      href: "https://www.ntnu.no",
      degree: "BACHELOR IN COMPUTER SCIENCE, EQF level 6 - Grade A thesis, Eurika Prize (NTNU)",
      logoUrl: "/ntnu.svg",
      start: "aug 2022",
      end: "June 2025",
    },
    {
      school: "Sandnessjøen VGS",
      href: "https://sandnessjoen.vgs.no",
      degree: "VITNEMÅL, QF level 4",
      logoUrl: "/vgs.png",
      start: "aug 2019",
      end: "june 2022",
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
      title: "1.2.watch (kotlin)",
      href: "https://github.com/yasinhessnawi1/1-2-watch",
      dates: "sep 2024 - nov 2024",
      active: true,
      description:" Developed 1.2.Watch, pronounced “When to Watch”, is a user-friendly application designed to help you keep track of all your favorite media—be it movies, series, or anime. With a friendly and intuitive interface, you’ll have all the information about your beloved media in one place. Know exactly when the next episode airs and where to watch it, if available. Find out when new movies are released or become available for streaming. Discover new and related content based on what you already love. (Mobile Programming course exam)(KOTLIN)\n",
      technologies: [
        "Kotlin", "XML", "Android Studio",
      ],
      links: [
        {
          type: "Repository",
          href: "https://github.com/yasinhessnawi1/1-2-watch",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "/1.2.Watch.mp4",
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

  latestWork: [
    {
      title: "Declassifai",
      href: "https://declassifai.com",
      dates: "Aug 2025 - Present",
      active: true,
      description: "Developed Declassifai, a web application for detecting and redacting sensitive documents in PDFs. The application utilizes AI and machine learning to automatically identify sensitive information and provides tools for manual highlighting and redaction. Features include AI-powered automatic detection, customizable redaction modes, and support for various document formats.",
      technologies: [
        "AI/ML",
        "React",
        "Python",
        "PDF Processing",
      ],
      links: [
        {
          type: "Website",
          href: "https://declassifai.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/dashboard_en.png",
      video: "",
    },
    {
      title: "Safe Media AI AS",
      href: "https://safemediai.com",
      dates: "Aug 2025 - Present",
      active: true,
      description: "Co-founded Safe Media AI AS, a company specializing in AI-powered document security solutions. The company is responsible for Declassifai and is developing further products focused on secure document processing and AI-driven security solutions.",
      technologies: [
        "AI/ML",
        "Document Security",
        "Product Development",
      ],
      links: [
        {
          type: "Website",
          href: "https://safemediai.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
  ],

} as const;
