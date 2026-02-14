import { Brain, Code, Database, Globe, Layers, Layout, Lock, Server, Smartphone, Terminal, Cpu, Box } from 'lucide-react';

export const ROLES = {
    "ml-engineer": {
        id: "ml-engineer",
        title: "ML Engineer",
        icon: "Brain",
        description: "Design and build scalable machine learning systems.",
        skills: {
            technical: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "MLflow", "Docker", "SQL", "Statistics"],
            nonTechnical: ["Research mindset", "Technical writing", "Experimentation"]
        }
    },
    "frontend-dev": {
        id: "frontend-dev",
        title: "Frontend Developer",
        icon: "Layout",
        description: "Create stunning, responsive user interfaces.",
        skills: {
            technical: ["JavaScript", "TypeScript", "React", "CSS", "HTML", "Git", "REST APIs", "Testing"],
            nonTechnical: ["UI/UX sense", "Attention to detail", "Communication"]
        }
    },
    "backend-dev": {
        id: "backend-dev",
        title: "Backend Developer",
        icon: "Server",
        description: "Build robust server-side logic and APIs.",
        skills: {
            technical: ["Node.js", "Python", "Java", "SQL", "NoSQL", "REST APIs", "Docker", "Git", "Auth"],
            nonTechnical: ["System thinking", "Documentation", "Problem solving"]
        }
    },
    "full-stack": {
        id: "full-stack",
        title: "Full Stack Developer",
        icon: "Layers",
        description: "Master both client and server-side development.",
        skills: {
            technical: ["JavaScript", "React", "Node.js", "SQL", "NoSQL", "REST APIs", "Git", "Docker"],
            nonTechnical: ["Communication", "Adaptability", "Time management"]
        }
    },
    "data-scientist": {
        id: "data-scientist",
        title: "Data Scientist",
        icon: "Database",
        description: "Extract insights from complex data sets.",
        skills: {
            technical: ["Python", "Pandas", "NumPy", "Scikit-learn", "SQL", "Statistics", "Data Viz"],
            nonTechnical: ["Analytical thinking", "Storytelling", "Business acumen"]
        }
    },
    "devops": {
        id: "devops",
        title: "DevOps Engineer",
        icon: "Terminal",
        description: "Streamline deployment and operations.",
        skills: {
            technical: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Ansible", "Bash"],
            nonTechnical: ["Incident management", "Documentation", "Collaboration"]
        }
    },
    "cybersecurity": {
        id: "cybersecurity",
        title: "Cybersecurity Analyst",
        icon: "Lock",
        description: "Protect systems from digital threats.",
        skills: {
            technical: ["Networking", "Linux", "Python", "SIEM", "Penetration testing", "Cryptography", "Firewalls"],
            nonTechnical: ["Analytical thinking", "Attention to detail", "Ethics"]
        }
    },
    "mobile-dev": {
        id: "mobile-dev",
        title: "Mobile Developer",
        icon: "Smartphone",
        description: "Build native applications for iOS and Android.",
        skills: {
            technical: ["React Native", "Flutter", "JavaScript", "Dart", "iOS/Android SDK", "REST APIs", "Git"],
            nonTechnical: ["UX intuition", "Performance mindset", "User empathy"]
        }
    },
    "cloud-architect": {
        id: "cloud-architect",
        title: "Cloud Architect",
        icon: "Globe",
        description: "Design scalable cloud infrastructure.",
        skills: {
            technical: ["AWS", "GCP", "Azure", "Terraform", "Kubernetes", "Networking", "Security", "Microservices"],
            nonTechnical: ["Strategic thinking", "Communication", "Documentation"]
        }
    },
    "blockchain-dev": {
        id: "blockchain-dev",
        title: "Blockchain Dev",
        icon: "Box",
        description: "Build decentralized applications and smart contracts.",
        skills: {
            technical: ["Solidity", "Web3.js", "JavaScript", "Smart contracts", "Ethereum", "Cryptography"],
            nonTechnical: ["Analytical thinking", "Continuous learning", "Community engagement"]
        }
    }
};
