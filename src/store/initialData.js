export const initialNodes = [
    // Generation 1: Pran (M) & Gyanwati (F) - Center at 2250
    { id: 'pran', type: 'person', position: { x: 2250, y: 0 }, data: { name: 'Pran Nath Sood', gender: 'male', birthYear: '1911' } },
    { id: 'gyanwati', type: 'person', position: { x: 2600, y: 0 }, data: { name: 'Gyanwati Sood', gender: 'female', birthYear: '1915' } },
    { id: 'm1', type: 'marriage', position: { x: 2490, y: 101 }, data: {} }, // 2490 to center 30px node slightly better? Center is 2425 (mid of 2250/2600) + 70ish?
    // Parent Width ~140. Midpoint between 2250 and 2600.
    // Parent 1 Center: 2250 + 70 = 2320. Parent 2 Center: 2600 + 70 = 2670. Midpoint = 2495.
    // Marriage Node (30px wide). Pos X should be Midpoint - 15 = 2480.
    // Let's use 2480 instead of 2490 for perfect X centering.

    // Generation 2 - Spaced by 1500px
    // Branch 1: Kailash (M) & Saroj (F)
    { id: 'kailash', type: 'person', position: { x: 0, y: 400 }, data: { name: 'Kailash Nath Kashyap', gender: 'male' } },
    { id: 'saroj', type: 'person', position: { x: 350, y: 400 }, data: { name: 'Saroj Sood Kashyap', gender: 'female', birthYear: '1937' } },
    { id: 'm-kashyap', type: 'marriage', position: { x: 230, y: 501 }, data: {} }, // 175 mid - 15 = 160? No.
    // Node 1: 0..140. Node 2: 350..490.
    // Center 1: 70. Center 2: 420. Midpoint: 245.
    // Marriage X: 245 - 15 = 230. Correct.

    // Branch 2: Vinod (M) & Brij (F)
    { id: 'vinod', type: 'person', position: { x: 1500, y: 400 }, data: { name: 'Vinod Sood Gopal', gender: 'male', birthYear: '1939' } },
    { id: 'brij', type: 'person', position: { x: 1850, y: 400 }, data: { name: 'Brij Sahish Chandra Gopal', gender: 'female' } },
    { id: 'm-gopal', type: 'marriage', position: { x: 1730, y: 501 }, data: {} }, // 1500+230

    // Branch 3: Jatinder (M) & Padmavati (F)
    { id: 'jatinder', type: 'person', position: { x: 3000, y: 400 }, data: { name: 'Jatinder Nath Sood', gender: 'male', birthYear: '1941' } },
    { id: 'padmavati', type: 'person', position: { x: 3350, y: 400 }, data: { name: 'Padmavati Sood', gender: 'female', birthYear: '1943' } },
    { id: 'm-jatinder', type: 'marriage', position: { x: 3230, y: 501 }, data: {} },

    // Branch 4: Virendra (M) & Suniti (F)
    { id: 'virendra', type: 'person', position: { x: 4500, y: 400 }, data: { name: 'Virendra Mohan Sood', gender: 'male', birthYear: '1945' } },
    { id: 'suniti', type: 'person', position: { x: 4850, y: 400 }, data: { name: 'Suniti Sood', gender: 'female', birthYear: '1949' } },
    { id: 'm-virendra', type: 'marriage', position: { x: 4730, y: 501 }, data: {} },

    // Generation 3
    // Branch 1 (Kailash)
    { id: 'anil', type: 'person', position: { x: -200, y: 800 }, data: { name: 'Anil Kashyap', gender: 'male' } },
    { id: 'durr', type: 'person', position: { x: 150, y: 800 }, data: { name: 'Durr', gender: 'female' } },
    { id: 'm-anil', type: 'marriage', position: { x: 30, y: 901 }, data: {} }, // -200..-60(140) center -130. 150..290 center 220. Midpoint (-130+220)/2 = 45. Minus 15 = 30.

    { id: 'mischa', type: 'person', position: { x: 500, y: 800 }, data: { name: 'Mischa', gender: 'male' } },
    { id: 'ritu', type: 'person', position: { x: 850, y: 800 }, data: { name: 'Ritu Kashyap', gender: 'female' } },
    { id: 'm-ritu', type: 'marriage', position: { x: 730, y: 901 }, data: {} }, // 500+230

    { id: 'rupali_k', type: 'person', position: { x: 200, y: 1200 }, data: { name: 'Rupali Kashyap', gender: 'female' } },
    { id: 'tanya_k', type: 'person', position: { x: 550, y: 1200 }, data: { name: 'Tanya Kashyap', gender: 'female' } },

    // Branch 2 (Vinod)
    { id: 'aniel', type: 'person', position: { x: 1300, y: 800 }, data: { name: 'Aniel Bhatia', gender: 'male' } },
    { id: 'reenu', type: 'person', position: { x: 1650, y: 800 }, data: { name: 'Reenu Bhatia', gender: 'female' } },
    { id: 'm-reenu', type: 'marriage', position: { x: 1530, y: 901 }, data: {} },

    { id: 'naveen', type: 'person', position: { x: 2000, y: 800 }, data: { name: 'Naveen Gopal', gender: 'male' } },
    { id: 'reema_g', type: 'person', position: { x: 2350, y: 800 }, data: { name: 'Reema Gopal', gender: 'female' } },
    { id: 'm-naveen', type: 'marriage', position: { x: 2230, y: 901 }, data: {} },

    // Generation 4 (Gopal Branch)
    { id: 'vani', type: 'person', position: { x: 1475, y: 1100 }, data: { name: 'Vani Bhatia', gender: 'female' } },
    { id: 'muskaan', type: 'person', position: { x: 2175, y: 1100 }, data: { name: 'Muskaan Gopal', gender: 'female' } },
    { id: 'mehak', type: 'person', position: { x: 2525, y: 1100 }, data: { name: 'Mehak Gopal', gender: 'female' } },

    // Branch 3 (Jatinder)
    { id: 'manoj', type: 'person', position: { x: 2825, y: 800 }, data: { name: 'Manoj Sood', gender: 'male', birthYear: '1968' } },
    { id: 'nitu', type: 'person', position: { x: 3175, y: 800 }, data: { name: 'Nitu Sood', gender: 'female', birthYear: '1973' } },
    { id: 'm-manoj', type: 'marriage', position: { x: 3055, y: 901 }, data: {} },
    { id: 'shalu', type: 'person', position: { x: 3525, y: 800 }, data: { name: 'Shalu Sood Luthra', gender: 'female', birthYear: '1972' } },

    // Generation 4 (Jatinder Branch)
    { id: 'bhavesh_s', type: 'person', position: { x: 3000, y: 1100 }, data: { name: 'Bhavesh Sood', gender: 'male', birthYear: '1995' } },

    // Branch 4 (Virendra)
    { id: 'rishi', type: 'person', position: { x: 4325, y: 800 }, data: { name: 'Rishi Sood', gender: 'male', birthYear: '1971' } },
    { id: 'neha', type: 'person', position: { x: 4675, y: 800 }, data: { name: 'Neha Sood', gender: 'female', birthYear: '1977' } },
    { id: 'm-rishi', type: 'marriage', position: { x: 4555, y: 901 }, data: {} },

    { id: 'gaurav', type: 'person', position: { x: 5025, y: 800 }, data: { name: 'Gaurav Sood', gender: 'male', birthYear: '1977' } },
    { id: 'amrita', type: 'person', position: { x: 5375, y: 800 }, data: { name: 'Amrita Sood', gender: 'female', birthYear: '1981' } },
    { id: 'm-gaurav', type: 'marriage', position: { x: 5255, y: 901 }, data: {} },

    // Generation 4 (Virendra Branch)
    { id: 'vihaan', type: 'person', position: { x: 4500, y: 1100 }, data: { name: 'Vihaan Sood', gender: 'male', birthYear: '2008' } },
];

export const initialEdges = [
    // Gen 1 Marriage (Pran - Gyanwati)
    { id: 'e-pran-m1', source: 'pran', target: 'm1', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-m1-gyanwati', source: 'm1', target: 'gyanwati', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    // Gen 2 Children (From Marriage 1)
    { id: 'e-m1-saroj', source: 'm1', target: 'saroj', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-m1-vinod', source: 'm1', target: 'vinod', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-m1-jatinder', source: 'm1', target: 'jatinder', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-m1-virendra', source: 'm1', target: 'virendra', sourceHandle: 'bottom', targetHandle: 'top' },

    // Gen 2 Marriages
    { id: 'e-kailash-mk', source: 'kailash', target: 'm-kashyap', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mk-saroj', source: 'm-kashyap', target: 'saroj', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    { id: 'e-vinod-mg', source: 'vinod', target: 'm-gopal', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mg-brij', source: 'm-gopal', target: 'brij', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    { id: 'e-jatinder-mj', source: 'jatinder', target: 'm-jatinder', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mj-padmavati', source: 'm-jatinder', target: 'padmavati', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    { id: 'e-virendra-mv', source: 'virendra', target: 'm-virendra', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mv-suniti', source: 'm-virendra', target: 'suniti', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    // Gen 3 Children (From Marriage Nodes)
    // Kashyap
    { id: 'e-mk-anil', source: 'm-kashyap', target: 'anil', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-mk-ritu', source: 'm-kashyap', target: 'ritu', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-mk-rupali', source: 'm-kashyap', target: 'rupali_k', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-mk-tanya', source: 'm-kashyap', target: 'tanya_k', sourceHandle: 'bottom', targetHandle: 'top' },

    { id: 'e-anil-ma', source: 'anil', target: 'm-anil', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-ma-durr', source: 'm-anil', target: 'durr', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    { id: 'e-mischa-mr', source: 'mischa', target: 'm-ritu', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mr-ritu', source: 'm-ritu', target: 'ritu', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    // Gopal
    { id: 'e-mg-aniel', source: 'm-gopal', target: 'aniel', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-mg-naveen', source: 'm-gopal', target: 'naveen', sourceHandle: 'bottom', targetHandle: 'top' },

    { id: 'e-aniel-mre', source: 'aniel', target: 'm-reenu', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mre-reenu', source: 'm-reenu', target: 'reenu', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    { id: 'e-naveen-mn', source: 'naveen', target: 'm-naveen', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mn-reema', source: 'm-naveen', target: 'reema_g', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    // Gen 4 Gopal
    { id: 'e-mre-vani', source: 'm-reenu', target: 'vani', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-mn-muskaan', source: 'm-naveen', target: 'muskaan', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-mn-mehak', source: 'm-naveen', target: 'mehak', sourceHandle: 'bottom', targetHandle: 'top' },

    // Jatinder
    { id: 'e-mj-manoj', source: 'm-jatinder', target: 'manoj', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-mj-shalu', source: 'm-jatinder', target: 'shalu', sourceHandle: 'bottom', targetHandle: 'top' },

    { id: 'e-manoj-mnn', source: 'manoj', target: 'm-manoj', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mnn-nitu', source: 'm-manoj', target: 'nitu', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mnn-bhavesh', source: 'm-manoj', target: 'bhavesh_s', sourceHandle: 'bottom', targetHandle: 'top' },

    // Virendra
    { id: 'e-mv-rishi', source: 'm-virendra', target: 'rishi', sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e-mv-gaurav', source: 'm-virendra', target: 'gaurav', sourceHandle: 'bottom', targetHandle: 'top' },

    { id: 'e-rishi-mnr', source: 'rishi', target: 'm-rishi', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mnr-neha', source: 'm-rishi', target: 'neha', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    { id: 'e-gaurav-mng', source: 'gaurav', target: 'm-gaurav', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },
    { id: 'e-mng-amrita', source: 'm-gaurav', target: 'amrita', sourceHandle: 'right', targetHandle: 'left', type: 'straight', style: { stroke: '#ef4444', strokeWidth: 4 } },

    { id: 'e-mnr-vihaan', source: 'm-rishi', target: 'vihaan', sourceHandle: 'bottom', targetHandle: 'top' },
];
