# Claude Code: Complete Beginner's Guide

## Table of Contents
1. [What is Claude Code?](#what-is-claude-code)
2. [Getting Started](#getting-started)
3. [IDE Integration Features](#ide-integration-features)
4. [Working Modes Explained](#working-modes-explained)
5. [Essential Commands](#essential-commands)
6. [Understanding Context Windows](#understanding-context-windows)
7. [Tips for Success](#tips-for-success)
8. [Pricing Guide](#pricing-guide)

---

## What is Claude Code?

### The Simple Explanation
Think of Claude Code as a super-smart coding assistant that lives in your terminal (the command line window). Instead of just suggesting small code completions like other tools, Claude Code can understand entire projects and make complex changes across multiple files.

**Analogy**: If regular code completion tools are like autocorrect for your writing, Claude Code is like having an experienced developer sitting next to you who can understand your entire project and make changes for you.

### What Makes It Different?
- **Terminal-Based**: It runs in your command line, not inside a specific code editor
- **Works Everywhere**: Because it's in the terminal, you can use it with ANY code editor (VS Code, Cursor, JetBrains, even Vim!)
- **Agent-Based**: It can complete entire tasks, not just suggest the next line of code

---

## Getting Started

### Installation (Step-by-Step)

**Step 1: Install Claude Code**
```bash
npm install -g @anthropic-ai/claude-code
```
**What this does**: Downloads and installs Claude Code on your computer globally (the `-g` flag means "global," so you can use it anywhere)

**Step 2: Authenticate**
```bash
claude
```
**What this does**: First time you run this, it will ask you to log in with your Anthropic account

**Step 3: Open in Your Project**
```bash
cd /path/to/your/project
claude
```
**What this does**: Starts Claude Code in your project directory so it can see and modify your code

### Your First Command: /init

**What it does**: Creates a special file called `claude.md` that contains an overview of your entire codebase. Think of it like Claude reading through your entire project and taking notes about what everything does.

**How to use it**:
```bash
/init
```
Just type this command and press Enter. Then wait 3-5 minutes while Claude explores your code.

**Why it's useful**:
- Claude learns about your project structure
- Future requests will be smarter because Claude "remembers" what your code does
- It's like giving Claude a map of your project before asking for directions

**When to use it**:
- First time using Claude Code in a new project
- After major restructuring of your codebase
- When Claude seems confused about your project structure

---

## IDE Integration Features

### Feature 1: File Awareness

**What it does**: Claude Code can "see" which file you're currently looking at in your code editor.

**How it works**:
1. Open a file in VS Code or Cursor (e.g., `app.js`)
2. Look at your Claude Code terminal
3. You'll see it say something like "Currently viewing: app.js"
4. Switch to a different file (e.g., `config.js`)
5. Claude Code updates to show "Currently viewing: config.js"

**Why it's useful**:
- You don't have to manually tell Claude which file you're working on
- Claude automatically understands the context of what you're doing
- Saves time when asking questions about the current file

**Example scenario**:
You're looking at a bug in `userAuth.js`. You open Claude Code and type "Why isn't this authentication working?" Claude already knows you're in `userAuth.js` and will focus on that file.

### Feature 2: Line Selection

**What it does**: You can highlight specific lines of code in your editor and send them directly to Claude Code.

**How to use it** (on macOS):
1. Highlight the lines of code you want to reference (e.g., lines 25-40)
2. Press `Cmd + Option + K` on your keyboard
3. Look at your Claude Code terminal - the highlighted code appears there
4. Now type your question or request

**How to use it** (on Windows/Linux):
Usually `Ctrl + Alt + K` (may vary by editor)

**Why it's useful**:
- You can point Claude to the exact code you're asking about
- No need to copy-paste code snippets
- Claude sees the code in context with line numbers

**Example scenario**:
```javascript
// You highlight these lines:
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}
```
Then press `Cmd + Option + K` and ask: "Can you add tax calculation to this function?"

Claude sees exactly which function you mean and can modify it precisely.

---

## Working Modes Explained

Claude Code has two main modes that change how it makes changes to your code.

### Mode 1: Auto Accept Edits

**What it does**: Claude makes changes to your files automatically without asking for permission each time.

**How to activate it**:
1. Open Claude Code terminal
2. Press `Shift + Tab` once
3. You'll see "Auto Accept Edits: ON"

**Why it's useful**:
- Faster workflow - no need to approve every single change
- Good for small, straightforward tasks
- Less interruption when you trust Claude's changes

**When to use it**:
- Small refactoring tasks
- Formatting changes
- Adding simple features you're confident about

**Warning**:
Only use this when you're comfortable with Claude making changes on its own. Always review changes afterward!

**Example scenario**:
"Rename all instances of `getUserData` to `fetchUserData`" - this is safe for auto-accept because it's a simple find-and-replace operation.

### Mode 2: Plan Mode (Recommended for Beginners)

**What it does**: Claude creates a complete plan of what it's going to do BEFORE making any changes. You review the plan, then approve it to proceed.

**How to activate it**:
1. Open Claude Code terminal
2. Press `Shift + Tab` twice (you'll see "Plan Mode: ON")
3. Now you're in Plan Mode

**The Workflow** (Step-by-Step):

**Step 1: Give Your Request**
```
Add a dark mode toggle to the settings page
```

**Step 2: Claude Researches** (3-5 minutes)
- Claude explores your codebase
- Looks at related files
- Figures out the best approach
- *No changes are made yet*

**Step 3: Claude Presents the Plan**
You'll see something like:
```
PLAN:
1. Create new DarkModeToggle component
2. Add dark mode state to settings context
3. Create CSS variables for dark theme colors
4. Update Settings.js to include the toggle
5. Add theme persistence to localStorage
```

**Step 4: Review and Approve**
- Read through the plan
- Make sure it makes sense
- If good, click "Apply" or type "yes"
- If not good, type "no" and give feedback

**Step 5: Claude Executes**
- Creates a checklist from the plan
- Goes through each step one by one
- Shows you progress as it works

**Why it's useful**:
- You see the strategy before any code changes
- Catch problems before they happen
- Learn Claude's approach to solving problems
- Feel safer with bigger changes

**When to use it**:
- Learning a new codebase
- Complex features with multiple files
- When you're not sure how to approach a problem
- Anytime you want more control

**Example scenario**:
You want to "Add user authentication to the app." This is complex and touches many files. Plan mode lets you see that Claude plans to:
1. Create auth service
2. Add login/signup forms
3. Create protected routes
4. Add JWT token handling
5. Update API calls to include auth headers

You review this and say "Actually, we're using OAuth, not JWT." Claude adjusts the plan before writing any code.

---

## Essential Commands

### /init - Initialize Your Project

**Full explanation**: This is the first command you should run in any new project.

**What happens when you run it**:
1. Claude reads through your entire codebase
2. Analyzes file structure and relationships
3. Creates a `claude.md` file with notes about your project
4. Takes 3-5 minutes for medium-sized projects

**Why it's important**:
- Dramatically improves Claude's understanding of your code
- Makes future requests more accurate
- Helps Claude find the right files automatically

**When to use it**:
- First time in a new project (mandatory)
- After major restructuring
- If Claude seems "confused" about your project

### Slash Commands Overview

While `/init` is the most important command mentioned in the video, here are other commands available:

- `/help` - Shows all available commands
- `/model` - Choose which AI model to use (Opus 4, Sonnet 4, etc.)
- `/resume` - Continue a previous conversation
- `/clear` - Start a fresh conversation
- `/login` - Authenticate with Anthropic

---

## Understanding Context Windows

### What is a Context Window?

**Simple explanation**: Think of it like Claude's "working memory." It's how much information Claude can "remember" and think about at once.

**Analogy**: Imagine you're juggling. A small context window is like juggling 3 balls. A full context window is like juggling 20 balls - it becomes impossible to keep track of everything.

### The Context Indicator

**What it looks like**: A green dot in the bottom right corner of your Claude Code terminal

**How it works**:
- Starts green when you begin a conversation
- Shows a percentage when 20-30% full
- As you add more files, messages, and code, it fills up
- When too full, Claude can't remember earlier parts of the conversation

**Example of what you might see**:
```
Context: 35% full
```

**Why it matters**:
- If context is too full, Claude might "forget" important details
- Quality of responses decreases when context is overloaded
- You might need to start a new conversation

### Managing Your Context

**When to take action**: When the indicator shows 60-80% full

**What to do**:
1. **Option 1**: Use the summary command (mentioned in video, specific command not shown)
   - Claude summarizes the conversation
   - Keeps important info, removes redundant parts
   - Frees up space to continue working

2. **Option 2**: Start a new conversation
   - Use `/clear` to start fresh
   - Give Claude a brief summary of what you were doing
   - Continue with more space

**Best practices**:
- Don't ignore the context warning
- Start new conversations for new features
- Keep conversations focused on one topic when possible

---

## Tips for Success

### Tip 1: Write Shorter Prompts

**What this means**: Unlike other AI tools, Claude Code is very good at figuring things out on its own.

**Bad prompt** (too detailed):
```
Look at src/components/UserProfile.js and src/services/api.js
and src/utils/validation.js. I want you to add email validation
to the user profile form. Make sure to use the existing validation
utility and update the API call to include the validated email.
```

**Good prompt** (let Claude explore):
```
Add email validation to the user profile form
```

**Why this works**:
- Claude automatically finds the relevant files
- It explores the codebase to understand your patterns
- It discovers your existing validation utilities
- Results in better, more consistent code

### Tip 2: Embrace the Wait Time

**The reality**: Commands can take 3-5 minutes to complete.

**Why it's worth it**:
- Claude is doing thorough research
- Exploring your codebase deeply
- Planning the best approach
- This results in significantly better code

**Mindset shift**:
Instead of: "Why is this taking so long?"
Think: "Claude is being thorough to get it right the first time"

**What to do while waiting**:
- Review the plan Claude is creating
- Think about test cases
- Grab coffee
- Review the research Claude shows you

### Tip 3: Trust Plan Mode When Learning

**Why**: Plan mode is the best teacher

**What you learn**:
- How experienced developers approach problems
- Which files need to be changed for different features
- How to structure code changes
- Common patterns in your codebase

**How to use it for learning**:
1. Ask Claude to implement something you don't know how to do
2. Read the plan carefully
3. Ask questions about why Claude chose that approach
4. Watch as it implements each step
5. Review the final code to understand what changed

---

## Pricing Guide

### Understanding the Tiers

**Important context**: All plans give you access to Claude Code, but they differ in how much you can use it (rate limits).

### Entry Level: ~$17/month
**What you get**:
- Basic access to Claude Code
- Limited requests per day
- Good for occasional use

**Best for**:
- Trying out Claude Code
- Hobby projects
- Light usage (few requests per day)

### Mid Tier: Pro Plan
**What you get**:
- More requests per day
- Access to different models
- Better for regular use

**Best for**:
- Regular coding projects
- Learning and experimenting
- Side projects

### High Tier: Max 5X Plan
**What you get**:
- Even more requests
- Higher rate limits
- More Opus 4 access

**Best for**:
- Professional developers
- Daily usage
- Multiple projects

### Top Tier: Max 20X Plan (~$200/month)
**What you get**:
- Maximum requests per day
- Best access to Claude Opus 4 (the smartest model)
- Highest rate limits

**Best for**:
- Full-time professional use
- When code quality is critical
- When you need the best possible results

### Which Model Matters?

**Claude Opus 4**:
- Best for coding tasks
- Most expensive to use
- Smartest and most accurate
- What you want for complex problems

**Claude Sonnet 4**:
- Good for general tasks
- Less expensive
- Faster but slightly less accurate
- Fine for simpler requests

**Why the video creator pays $200/month**:
- Maximum access to Opus 4
- Best possible code quality
- Fewer bugs and errors
- Worth it for professional work

### Should You Pay for the Top Tier?

**Start with**: Lower tier to try it out

**Upgrade if**:
- You use Claude Code every day
- Code quality directly affects your income
- You find yourself hitting rate limits
- You need the absolute best results

**Don't upgrade if**:
- You're just learning to code
- You use it occasionally
- You're on a tight budget
- Lower tiers meet your needs

---

## Understanding the Speed vs. Quality Trade-off

### The Core Concept

**What you need to know**: Claude Code is slower than other tools, but produces better code.

**The trade-off**:
- **Other tools**: Fast but more bugs, need more fixes later
- **Claude Code**: Slower but fewer bugs, less fixing needed

**Math that matters**:
- Cursor: 30 seconds to get code + 20 minutes fixing bugs = 20.5 minutes
- Claude Code: 5 minutes to get code + 2 minutes fixing bugs = 7 minutes

**The video creator's experience**:
> "I found that Claude Code is consistently able to make higher quality changes and results in code that is significantly less buggy compared to cursor."

### When Speed Matters More
- Quick experiments
- Throwaway prototypes
- Learning exercises

### When Quality Matters More
- Production code
- Complex features
- Code that others will use
- When bugs are costly

---

## Common Beginner Mistakes to Avoid

### Mistake 1: Not Running /init
**Problem**: Claude doesn't understand your project
**Solution**: Always run `/init` first thing in new projects

### Mistake 2: Over-Explaining in Prompts
**Problem**: Providing too much detail that Claude can find on its own
**Solution**: Start with simple requests, add details only if needed

### Mistake 3: Ignoring Context Warnings
**Problem**: Continuing when context is 90% full leads to poor results
**Solution**: Summarize or start new conversation at 60-70% full

### Mistake 4: Not Using Plan Mode as a Beginner
**Problem**: Auto-accept can make confusing changes you don't understand
**Solution**: Use Plan Mode to learn Claude's approach first

### Mistake 5: Expecting Instant Results
**Problem**: Getting frustrated with 3-5 minute wait times
**Solution**: Understand this time investment prevents hours of debugging

---

## Practical Example Walkthrough

Let's walk through a complete example of using Claude Code to add a feature.

### Scenario: Add a Search Feature to Your App

**Step 1: Start Claude Code**
```bash
cd /path/to/your/project
claude
```

**Step 2: Activate Plan Mode**
Press `Shift + Tab` twice

**Step 3: Make Your Request**
```
Add a search bar to the homepage that filters the product list
```

**Step 4: Watch Claude Research**
You'll see messages like:
```
Reading src/components/Homepage.js...
Reading src/components/ProductList.js...
Reading src/state/products.js...
Analyzing component structure...
```

**Step 5: Review the Plan**
Claude presents:
```
PLAN:
1. Create SearchBar component with input field
2. Add search state to Homepage component
3. Add filter function to ProductList component
4. Update product display to show filtered results
5. Add debouncing to search input for performance
```

**Step 6: Ask Questions if Needed**
```
Why are you adding debouncing?
```

Claude explains:
```
Debouncing prevents filtering on every keystroke, which would be
slow with large product lists. Instead, it waits 300ms after the
user stops typing before filtering.
```

**Step 7: Approve the Plan**
Type: `yes` or click "Apply"

**Step 8: Watch Progress**
```
✓ Creating SearchBar component
→ Adding search state to Homepage
  - Adding filter function to ProductList
  - Updating product display
  - Adding debouncing
```

**Step 9: Review Changes**
Look at the files Claude modified, test the feature

**Step 10: Iterate if Needed**
```
Can you make the search case-insensitive?
```

---

## Quick Reference Card

### First Time Setup
1. `npm install -g @anthropic-ai/claude-code`
2. `claude` (to authenticate)
3. Navigate to project: `cd /path/to/project`
4. `claude` (to start)
5. `/init` (to initialize project)

### Essential Keyboard Shortcuts
- `Cmd + Option + K` (Mac) or `Ctrl + Alt + K` (Windows/Linux): Add selected code to Claude
- `Shift + Tab`: Toggle Auto Accept
- `Shift + Tab` (twice): Toggle Plan Mode

### Best Practices Checklist
- [ ] Run `/init` in new projects
- [ ] Use Plan Mode when learning
- [ ] Write simple, short prompts
- [ ] Watch context window indicator
- [ ] Review plans before approving
- [ ] Test changes after Claude completes them

### When to Use What

| Task | Best Mode |
|------|-----------|
| Learning new codebase | Plan Mode |
| Complex features | Plan Mode |
| Simple refactoring | Auto Accept |
| Renaming variables | Auto Accept |
| Understanding code | Either mode |
| Multiple file changes | Plan Mode |

---

## Final Thoughts from the Video

### Why the Creator Switched from Cursor

**Main reason**: "Claude Code has significantly better output than Cursor's agent coding experience."

**What this means for you**:
- You'll write less buggy code
- You'll spend less time fixing errors
- You'll need to provide less detailed instructions
- You'll get better results even as a beginner

### Monthly Subscription Advice

**Key lesson**: Don't pay yearly for any AI tool right now

**Why**: The AI coding landscape changes rapidly
- What's best today might not be best next month
- New tools are constantly emerging
- Better to stay flexible

**Recommended approach**:
- Start with a lower-tier monthly plan
- Evaluate after one month
- Upgrade or switch as needed
- Stay on monthly billing

---

## Getting Help

If you need more information:
- Type `/help` in Claude Code terminal
- Visit Anthropic's documentation
- Experiment with simple tasks first
- Use Plan Mode to learn from Claude's approach

Remember: Claude Code is a tool to make you a better, more productive developer. Take time to learn it properly, and you'll see significant improvements in your coding workflow!
