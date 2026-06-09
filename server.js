const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'results.json');

app.use(express.json());
app.use(express.static('public'));

const SCHOOLS = [
  "MIT", "Yale", "Harvard", "Stanford", "Columbia", "NYU", "Penn State", "Purdue",
  "Michigan State", "University of Michigan", "UCLA", "UC San Diego", "UC Davis",
  "UC Santa Barbara", "UC Irvine", "UC Riverside", "Ohio State", "University of Wisconsin",
  "University of Minnesota", "University of Illinois", "University of Washington",
  "University of Texas Austin", "University of Arizona", "Arizona State",
  "University of Colorado Boulder", "University of Oregon", "University of Utah",
  "University of Virginia", "UNC Chapel Hill", "NC State", "Georgetown", "Johns Hopkins",
  "Vanderbilt", "Tufts", "Boston College", "Northeastern", "Brandeis", "Brown", "Dartmouth",
  "Wake Forest", "Tulane", "Villanova", "Notre Dame", "Carnegie Mellon", "Drexel",
  "Marquette", "Creighton", "Xavier", "Howard University", "University of Delaware",
  "University of Connecticut", "University of Rhode Island", "Quinnipiac",
  "University of New Hampshire", "University of Vermont", "Middlebury", "University of Maine",
  "Bowdoin", "Colby", "Amherst", "Williams", "Wesleyan", "Trinity", "Colgate", "Skidmore",
  "Union College", "Clarkson", "SUNY Buffalo", "SUNY Stony Brook", "SUNY Albany", "Adelphi",
  "Manhattan College", "Bryn Mawr", "Swarthmore", "Duquesne", "University of Pittsburgh",
  "University of Scranton", "University of Richmond", "William and Mary", "JMU",
  "Liberty University", "VCU", "University of South Carolina", "Clemson", "Furman",
  "University of Georgia", "Mercer", "Kennesaw State", "Georgia State",
  "University of Alabama", "UA Birmingham", "Samford", "University of Mississippi",
  "Mississippi State", "University of Tennessee", "Belmont", "University of Kentucky",
  "University of Louisville", "Western Kentucky", "Indiana University", "Butler",
  "Ball State", "DePauw", "Rose-Hulman", "Hope College", "University of Cincinnati",
  "Miami University Ohio", "Kenyon", "Denison", "Oberlin", "John Carroll",
  "University of Dayton", "University of Chicago", "Loyola Chicago", "UIC",
  "University of Iowa", "Iowa State", "Grinnell", "Drake", "University of Nebraska",
  "University of Missouri", "Washington University St Louis", "Kansas State",
  "University of Kansas", "University of Oklahoma", "Oklahoma State", "University of Tulsa",
  "TCU", "SMU", "Baylor", "Texas Tech", "UT Dallas", "Trinity University Texas",
  "Colorado State", "Colorado College", "University of Denver", "University of Wyoming",
  "Montana State", "University of Montana", "University of Idaho", "Utah State",
  "Brigham Young", "University of New Mexico", "University of Hawaii", "Chaminade",
  "University of Alaska", "Portland State", "Lewis and Clark", "Reed College",
  "Willamette", "Seattle Pacific", "Gonzaga", "Whitman", "Cal Poly SLO", "Cal Poly Pomona",
  "SFSU", "SDSU", "CSUN", "CSU Fullerton", "Pepperdine", "Sarah Lawrence",
  "Vassar", "Bard", "The New School", "School of Visual Arts", "RISD", "SCAD",
  "Art Center", "Babson", "Bentley", "Bryant University", "Roger Williams", "Salve Regina",
  "Providence College", "Fairfield University", "Sacred Heart", "Marist", "Siena College",
  "Skidmore College", "Hobart and William Smith", "Ithaca College", "St. Lawrence University",
  "Clarkson University", "Alfred University", "Elmira College", "Utica College",
  "Le Moyne College", "Canisius College", "Niagara University", "Buffalo State",
  "New Paltz", "Stony Brook", "Binghamton", "Fredonia", "Cortland", "Geneseo",
  "Oneonta", "Oswego", "Plattsburgh", "Purchase", "Potsdam", "Brockport", "Farmingdale"
];

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = SCHOOLS.map(name => ({
      school_name: name,
      state: "unknown",
      policy_year: "unknown",
      ivf_covered: "unknown",
      cycles: "unknown",
      ivf_language: "",
      min_credits: "unknown",
      credit_language: "",
      online_eligible: "unknown",
      status: "pending",
      error_message: "",
      source_url: ""
    }));
    saveData(initial);
    return initial;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/data', (req, res) => {
  res.json(loadData());
});

app.post('/api/add-school', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name required' });
  const data = loadData();
  if (data.find(s => s.school_name.toLowerCase() === name.trim().toLowerCase())) {
    return res.status(409).json({ error: 'School already exists' });
  }
  const entry = {
    school_name: name.trim(),
    state: "unknown",
    policy_year: "unknown",
    ivf_covered: "unknown",
    cycles: "unknown",
    ivf_language: "",
    min_credits: "unknown",
    credit_language: "",
    online_eligible: "unknown",
    status: "pending",
    error_message: "",
    source_url: ""
  };
  data.push(entry);
  saveData(data);
  res.json(entry);
});

app.post('/api/retry-errors', (req, res) => {
  const data = loadData();
  data.forEach(s => {
    if (s.status === 'error') {
      s.status = 'pending';
      s.error_message = '';
    }
  });
  saveData(data);
  res.json({ ok: true });
});

app.get('/api/research', async (req, res) => {
  const school = req.query.school;
  if (!school) return res.status(400).json({ error: 'school param required' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const data = loadData();
  const entry = data.find(s => s.school_name === school);
  if (!entry) return res.status(404).json({ error: 'School not found' });

  entry.status = 'scanning';
  saveData(data);

  const prompt = `Research the Student Health Insurance Plan (SHIP) for ${school} for the most current plan year (2025-2026 or 2024-2025).

Use web search to find the actual SHIP plan document or benefits summary. Look for the official university health insurance plan documents.

Extract these specific fields and return ONLY a valid JSON object (no markdown, no extra text):

{
  "state": "2-letter state code where the university is located",
  "policy_year": "plan year like 2025-2026",
  "ivf_covered": "yes, no, partial, or unknown",
  "cycles": "number of IVF cycles/oocyte retrievals covered, e.g. '3 oocyte retrievals per lifetime', 'unlimited', 'none', or 'unknown'",
  "ivf_language": "exact verbatim quote from plan document about IVF coverage, max 300 chars, empty string if not found",
  "min_credits": "minimum credit hours required for eligibility, e.g. '6', '9', 'full-time only', or 'unknown'",
  "credit_language": "exact verbatim quote about enrollment/credit requirements, max 300 chars, empty string if not found",
  "online_eligible": "yes if online/distance students are explicitly eligible, no if explicitly excluded, unknown otherwise",
  "source_url": "the URL of the plan document or benefits page you found"
}

For ivf_covered:
- "yes" = IVF is explicitly covered
- "partial" = some fertility treatments covered but IVF has limits or exclusions mentioned
- "no" = IVF is explicitly excluded
- "unknown" = couldn't find clear information

Be precise with verbatim quotes. Return only the JSON object.`;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'interleaved-thinking-2025-05-14',
          'content-type': 'application/json'
        },
        timeout: 120000
      }
    );

    let text = '';
    for (const block of response.data.content) {
      if (block.type === 'text') text += block.text;
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const result = JSON.parse(jsonMatch[0]);

    entry.state = result.state || 'unknown';
    entry.policy_year = result.policy_year || 'unknown';
    entry.ivf_covered = result.ivf_covered || 'unknown';
    entry.cycles = result.cycles || 'unknown';
    entry.ivf_language = (result.ivf_language || '').substring(0, 300);
    entry.min_credits = result.min_credits || 'unknown';
    entry.credit_language = (result.credit_language || '').substring(0, 300);
    entry.online_eligible = result.online_eligible || 'unknown';
    entry.source_url = result.source_url || '';
    entry.status = 'done';
    entry.error_message = '';

    saveData(data);
    res.json(entry);
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message || 'Unknown error';
    entry.status = 'error';
    entry.error_message = msg.substring(0, 200);
    saveData(data);
    res.status(500).json({ error: msg, entry });
  }
});

app.listen(PORT, () => {
  console.log(`SHIP IVF Research Tool running at http://localhost:${PORT}`);
  console.log(`API key: ${process.env.ANTHROPIC_API_KEY ? 'SET' : 'NOT SET — export ANTHROPIC_API_KEY=...'}`);
});
