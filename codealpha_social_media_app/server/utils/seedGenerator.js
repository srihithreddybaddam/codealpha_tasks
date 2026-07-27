// 80% Indian / 20% International Fictional Creator Generator
const indianFirstNames = [
  'Aarav', 'Riya', 'Arjun', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Kavya', 'Karthik', 'Sneha',
  'Vikram', 'Divya', 'Rahul', 'Pooja', 'Neha', 'Varun', 'Sanjay', 'Meera', 'Ishaan', 'Preeti',
  'Siddharth', 'Nisha', 'Aman', 'Tanvi', 'Yash', 'Shreya', 'Abhinav', 'Swati', 'Tarun', 'Anushka',
  'Manish', 'Deepika', 'Akash', 'Shruti', 'Gautam', 'Kritika', 'Nikhil', 'Bhavana', 'Sameer', 'Rashmi'
];

const indianLastNames = [
  'Sharma', 'Rao', 'Patel', 'Reddy', 'Verma', 'Iyer', 'Nair', 'Gupta', 'Joshi', 'Deshmukh',
  'Kulkarni', 'Chatterjee', 'Banerjee', 'Mehta', 'Kapoor', 'Singhal', 'Pillai', 'Menon', 'Saxena', 'Agarwal',
  'Chowdhury', 'Mishra', 'Trivedi', 'Bhat', 'Bose', 'Mukherjee', 'Dutta', 'Naidu', 'Shetty', 'Venkatesh'
];

const intlFirstNames = ['Aria', 'Kaito', 'Elena', 'Lucas', 'Sophia', 'Mateo', 'Chloe', 'Liam', 'Yuki', 'Ethan'];
const intlLastNames = ['Vance', 'Tanaka', 'Rostova', 'Silva', 'Lin', 'Dubois', 'Chen', 'Wright', 'Fischer', 'Santos'];

const indianProfessions = [
  { role: 'Software Engineer @ Bengaluru', bios: ['Building high-throughput backend microservices with Node.js & Go 🚀', 'Chai + Code = Productivity ☕💻 | Bengaluru Tech Scene'] },
  { role: 'UI/UX Architect @ Hyderabad', bios: ['Designing glassmorphic mobile & web interfaces ✨', 'Crafting intuitive digital product experiences | Hyderabad Tech Hub 🎨'] },
  { role: 'Startup Founder @ Gurugram', bios: ['Building AI-driven SaaS for Indian enterprises 💡', 'Tech entrepreneur & mentor | Angel Investor'] },
  { role: 'IAS Aspirant & Writer', bios: ['Preparing for Civil Services | Bookworm & Policy Enthusiast 📚', 'Writing about governance, economics & Indian heritage 🇮🇳'] },
  { role: 'Street & Travel Photographer', bios: ['Capturing monsoon reflections & heritage monuments across India 📸', 'Exploring hidden travel trails from Himalayas to Kerala 🏔️🌊'] },
  { role: 'Full Stack Dev @ Pune', bios: ['React, Node.js & Cloud Architect 💻', 'Hackathon lover & open source contributor'] },
  { role: 'Medical Resident @ AIIMS Delhi', bios: ['Doctor in training 🩺 | Healthcare tech enthusiast', 'Spreading health awareness & wellness advice'] },
  { role: 'Architecture Student @ Chennai', bios: ['Studying sustainable urban architecture & heritage restoration 🏛️', 'Sketching South Indian temple architecture & modern skylines'] }
];

const indianCities = [
  'Bengaluru, Karnataka', 'Hyderabad, Telangana', 'Mumbai, Maharashtra', 'Delhi NCR', 'Pune, Maharashtra',
  'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Ahmedabad, Gujarat', 'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh',
  'Indore, Madhya Pradesh', 'Surat, Gujarat', 'Visakhapatnam, Andhra Pradesh', 'Noida, UP', 'Gurugram, Haryana',
  'Goa', 'Kochi, Kerala', 'Bhopal, MP', 'Coimbatore, TN', 'Mysuru, Karnataka'
];

const intlCities = ['Tokyo, Japan', 'San Francisco, CA', 'London, UK', 'Berlin, Germany', 'Sydney, Australia'];

const avatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80'
];

const covers = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80'
];

const indianPostCategoryData = [
  {
    category: 'Technology & Startup',
    caption: 'Late night coding session at Bengaluru tech park with fresh filter coffee. Building scalable microservices with React & Node.js ☕💻 #bengalurutech #fullstackdev #startupindia #code',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    location: 'Koramangala, Bengaluru'
  },
  {
    category: 'Monsoon Photography',
    caption: 'Monsoon rains in Western Ghats. Green tea estates wrapped in morning fog under a soft misty sky 🌧️🍃 #monsoonvibes #westernghats #naturephotography #incredibleindia',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
    location: 'Munnar, Kerala'
  },
  {
    category: 'Heritage Architecture',
    caption: 'Ancient stone carving geometry and golden hour sunlight at Hampi ruins. Indian heritage architecture is unmatched! 🏛️✨ #hampi #architecture #heritage #travelindia',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
    location: 'Hampi, Karnataka'
  },
  {
    category: 'Design & UI/UX',
    caption: 'Designing Vibely\'s forward-luxury glassmorphic UI. Soft ambient shadows, frosted blur cards, and fluid Indian social interactions. Create. Connect. Inspire! ✨ #vibely2026 #glassmorphism #uidesign',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    location: 'HITEC City, Hyderabad'
  },
  {
    category: 'Chai & Food Culture',
    caption: 'Evening cutting chai & hot samosa break with the team after closing our sprint milestone ☕😋 #chaibreak #foodie #startupculture #hyderabad',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    location: 'Cyberabad, Hyderabad'
  },
  {
    category: 'ISRO Space Milestone',
    caption: 'Celebrating ISRO\'s newest space science launch! Proud moment for Indian engineering and innovation 🚀🇮🇳 #isro #space #science #india',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
    location: 'Sriharikota, AP'
  }
];

// Generate 80% Indian / 20% International Seed Users (~1000 accounts)
const generateSeedUsers = (count = 1000) => {
  const users = [];
  const usedUsernames = new Set();
  const usedEmails = new Set();

  for (let i = 0; i < count; i++) {
    const isIndian = i % 10 < 8; // 80% Indian

    const fn = isIndian
      ? indianFirstNames[i % indianFirstNames.length]
      : intlFirstNames[i % intlFirstNames.length];
    const ln = isIndian
      ? indianLastNames[(i * 3 + 1) % indianLastNames.length]
      : intlLastNames[(i * 2 + 1) % intlLastNames.length];

    const prof = isIndian
      ? indianProfessions[i % indianProfessions.length]
      : { role: 'Creator', bios: ['Creating, connecting & inspiring on Vibely ✨'] };

    const loc = isIndian
      ? indianCities[i % indianCities.length]
      : intlCities[i % intlCities.length];

    let username = `${fn.toLowerCase()}_${ln.toLowerCase()}${i > 50 ? i : ''}`;
    if (usedUsernames.has(username)) username = `${username}_${i}`;
    usedUsernames.add(username);

    let email = `${username}@vibely.app`;
    if (usedEmails.has(email)) email = `${username}_${i}@vibely.app`;
    usedEmails.add(email);

    users.push({
      _id: `65f1a2b3c4d5e6f7a8b9${(1000 + i).toString(16)}`,
      name: `${fn} ${ln}`,
      username,
      email,
      bio: prof.bios[i % prof.bios.length],
      avatar: avatars[i % avatars.length],
      coverImage: covers[i % covers.length],
      location: loc,
      website: `https://${username}.vibely.app`,
      statusBubble: i % 2 === 0 ? `Building ${prof.role} ✨` : 'Exploring Vibely 🇮🇳',
      role: i === 0 ? 'admin' : 'user',
      isVerified: i < 60 || i % 12 === 0,
      followersCount: 120 + (i * 43) % 9200,
      followingCount: 45 + (i * 21) % 1100,
      createdAt: new Date(Date.now() - (i * 86400000 + 1800000)).toISOString()
    });
  }

  return users;
};

// Generate Diverse Realistic Posts
const generateSeedPosts = (seedUsers, count = 100) => {
  const posts = [];
  for (let i = 0; i < count; i++) {
    const author = seedUsers[i % seedUsers.length];
    const catData = indianPostCategoryData[i % indianPostCategoryData.length];

    posts.push({
      _id: `65f2a1b3c4d5e6f7a8b9${(2000 + i).toString(16)}`,
      user: {
        _id: author._id,
        name: author.name,
        username: author.username,
        avatar: author.avatar,
        isVerified: author.isVerified
      },
      caption: catData.caption,
      imageUrl: catData.image,
      location: catData.location,
      likes: [seedUsers[(i + 1) % seedUsers.length]._id, seedUsers[(i + 2) % seedUsers.length]._id],
      likesCount: 24 + (i * 29) % 620,
      commentsCount: 5 + (i * 11) % 64,
      visibility: 'public',
      status: 'published',
      createdAt: new Date(Date.now() - (i * 5400000 + 900000)).toISOString(),
      updatedAt: new Date(Date.now() - (i * 5400000 + 900000)).toISOString()
    });
  }
  return posts;
};

module.exports = {
  generateSeedUsers,
  generateSeedPosts,
  indianPostCategoryData
};
