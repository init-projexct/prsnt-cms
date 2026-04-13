export default function handler(req, res) {
    const { code, lookupKey } = req.body; // lookupKey = "A01_KEY" or "B01_KEY"

    if (!lookupKey) return res.status(400).json({ error: "No lookup key provided" });

    // Directly access the environment variable using the key sent from the HTML
    const expectedSecret = process.env[lookupKey.toUpperCase()];

    if (code && code === expectedSecret) {
        // Successful login: Set the cookie for the Middleware
        res.setHeader('Set-Cookie', 'b_access=granted; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400');
        return res.status(200).json({ granted: true });
    }

    return res.status(401).json({ granted: false });
}
