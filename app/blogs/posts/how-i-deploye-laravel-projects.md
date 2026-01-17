title: " How I Deploy Laravel Projects: From Local to Production (Step-by-Step)
date: "2025-12-09"
category: "Laravel"

# How I Deploy Laravel Projects: From Local to Production (Step-by-Step)

Deploying Laravel isn't rocket science, but it's also not just dragging files onto a server and hoping for the best. I've screwed this up enough times to have a pretty solid process now. Here's what actually works for me.

## 1. Getting Everything Ready Locally

Before I touch the server, I make sure everything's clean on my end.

**Environment file (.env)**

I go through my `.env` and double-check the obvious stuff:

- Set `APP_ENV=production`
- Turn off `APP_DEBUG` (set it to `false`)
- Make sure database credentials are ready for production
- Same with mail settings

**Caching everything**

```
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

This speeds things up and honestly just makes the app feel snappier. Sometimes I run `php artisan optimize` too, though half the time I forget.

**Cleanup**

I'll remove any packages I'm not actually using and clear out logs. Nothing worse than deploying 200MB of local test logs to production.

## 2. Getting Files on the Server

How I do this depends on what I'm working with:

- **Shared hosting?** Usually FTP or cPanel's file manager
- **VPS?** I'll SSH in and pull from Git
- **Fancy setup?** GitHub Actions or some other CI tool

One thing that bit me early on: Laravel's `public` folder needs to be your document root. On shared hosting, I usually move everything up one level and drop the `public` folder contents into `public_html`. Annoying but necessary.

## 3. Installing Dependencies

Once the files are up there:

```
composer install --optimize-autoloader --no-dev
```

The `--no-dev` flag keeps out development stuff you don't need in production.

**Permissions are critical**

```
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

If you're on a Linux server:

```
chown -R www-data:www-data storage bootstrap/cache
```

Seriously, like 90% of "Laravel won't work on my server" issues come down to file permissions.

## 4. Environment Configuration

Every server's different, so I update the `.env` file with:

- Database connection details
- Mail server settings
- The correct `APP_URL`
- Generate an app key if needed: `php artisan key:generate`

## 5. Database Setup

```
php artisan migrate --force
```

The `--force` is needed because Laravel won't run migrations in production otherwise. If I need seed data:

```
php artisan db:seed --force
```

## 6. Web Server Setup

**Apache**

Usually just works if your document root points to the `public` folder. The `.htaccess` file handles the rest.

**Nginx**

I'll add something like this to the server block:

```
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

Otherwise clean URLs break.

## 7. Queue Workers (if you're using them)

For background jobs:

```
php artisan queue:work --daemon
```

On a VPS, I set up Supervisor to keep this running automatically. On shared hosting... well, you work with what you've got.

## 8. Cron Jobs

If you're using Laravel's scheduler, add this to cron:

```
* * * * * php /path/to/your/project/artisan schedule:run >> /dev/null 2>&1
```

Change the path to match your actual setup.

## 9. Final Touches

Run the optimize command one more time:

```
php artisan optimize
```

Make sure caching is still enabled:

```
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Double-check that `APP_DEBUG=false` in your `.env`.

**SSL/HTTPS**

Install an SSL certificate (Let's Encrypt is free and easy) and force HTTPS redirects. Most hosting panels make this pretty straightforward now.

## 10. Testing

Before I call it done, I actually test stuff:

- Can users log in?
- Does the database work?
- Can files be uploaded?
- Are emails sending?
- Does the admin panel load?

I'll check on mobile too, just to make sure nothing looks broken.

## What I've Learned

The first few times I deployed Laravel, something always went wrong. Forgot to set permissions, left debug mode on, didn't cache routes. Now I have this checklist and things go a lot smoother.

The key things that matter most:

- File permissions (seriously, get these right)
- Proper caching
- Environment configuration
- Testing before you tell everyone it's live

It's not perfect, but this process gets projects deployed without major headaches, whether I'm working with basic shared hosting or a full VPS setup.
