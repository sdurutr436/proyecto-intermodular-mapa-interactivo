# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our Interactive Map project seriously. If you have discovered a security vulnerability, we appreciate your help in disclosing it to us in a responsible manner.

### How to Report a Security Vulnerability

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Recommended)
   - Navigate to the Security tab of this repository
   - Click on "Report a vulnerability"
   - Fill out the form with details about the vulnerability

2. **Direct Contact**
   - Send an email with the vulnerability details
   - Use a descriptive subject line like "Security Vulnerability Report: [Brief Description]"

### What to Include in Your Report

To help us better understand and resolve the issue, please include:

- **Type of vulnerability** (e.g., XSS, SQL Injection, CSRF, authentication bypass)
- **Full paths of source file(s)** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability** and how an attacker might exploit it
- **Potential fixes** (if you have suggestions)

### What to Expect

After you submit a vulnerability report:

- **Acknowledgment**: Within **48 hours**
- **Initial Assessment**: Within **5 business days**
- **Updates**: Regular progress updates throughout the resolution process
- **Resolution**: Critical vulnerabilities within **30 days**
- **Disclosure**: Coordinated public disclosure typically **90 days** after report or when fixed
- **Credit**: With your permission, recognition in our security acknowledgments

## Security Best Practices

### For Users

1. **Environment Variables**: Never commit `.env` files containing sensitive data
2. **API Keys**: Keep your DeepL API key secure and never share it publicly
3. **Dependencies**: Regularly update dependencies to get security patches
4. **HTTPS**: Always use HTTPS in production environments

### For Contributors

1. **Code Review**: All code changes require review before merging
2. **Dependency Scanning**: We use Dependabot to monitor dependency vulnerabilities
3. **Input Validation**: Always validate and sanitize user inputs
4. **Secure Defaults**: Use secure defaults for all configurations
5. **Secrets Management**: Never hardcode credentials or API keys in the codebase

## Known Security Considerations

### API & Database

- **DeepL API Key**: Required for translation services. Must be stored in environment variables only.
- **MongoDB URI**: Use authentication in production and secure connection strings.

### Application Security

- **CORS**: Backend API has CORS configured. Review settings for your deployment environment.
- **XSS Protection**: React provides built-in protection. Avoid `dangerouslySetInnerHTML` unless necessary.
- **MongoDB Injection**: Mongoose provides protection. Always use parameterized queries.
- **Rate Limiting**: Consider implementing for API endpoints in production.

## Security Updates

Security patches will be:

- Released promptly after vulnerability confirmation
- Documented in release notes with a `[SECURITY]` tag
- Applied to all supported versions when applicable

## Disclosure Policy

We follow a **coordinated disclosure** approach:

1. Work with the reporter to understand and validate the issue
2. Develop and test a fix
3. Prepare a security advisory
4. Release the fix and publish the advisory via GitHub Security Advisories
5. Credit the reporter (unless they prefer anonymity)

We request reasonable time to fix issues before public disclosure, working with reporters to determine an appropriate timeline.

## Scope

The following are **in scope** for vulnerability reports:

- XSS, CSRF, and other injection vulnerabilities
- Authentication and authorization issues
- Server-side code execution
- SQL/NoSQL injection
- Security misconfigurations
- Sensitive data exposure
- API vulnerabilities

The following are **out of scope**:

- Social engineering attacks
- Physical attacks
- Denial of Service (DoS) attacks
- Vulnerabilities in third-party services we don't control
- Issues that require physical access to a user's device
- Recently disclosed zero-day vulnerabilities in dependencies (report these to Dependabot instead)

## Contact

For any questions about this security policy, please open an issue in this repository or contact the maintainers.

## Acknowledgments

We would like to thank the following individuals for responsibly disclosing security vulnerabilities:

- *No vulnerabilities reported yet*

---

**Last Updated**: January 2026
