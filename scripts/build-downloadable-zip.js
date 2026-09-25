import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function generateDownloadableZip() {
  console.log('Generating downloadable website ZIP archive...');
  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(process.cwd(), 'public');

  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Please run "npm run build" first.');
    process.exit(1);
  }

  const zip = new JSZip();

  // Helper to recursively add files to zip
  function addDirectoryToZip(dirPath, zipFolder) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.endsWith('.zip')) continue;
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const subFolder = zipFolder.folder(entry.name);
        addDirectoryToZip(fullPath, subFolder);
      } else {
        const fileData = fs.readFileSync(fullPath);
        zipFolder.file(entry.name, fileData);
      }
    }
  }

  // Add all dist files
  addDirectoryToZip(distDir, zip);

  // Add a helpful README to the zip root
  const readmeContent = `=====================================================
উল্লাপাড়া প্রেসক্লাব - অফিশিয়াল ওয়েবসাইট প্যাকেজ
Ullapara Press Club - Official Website Package
=====================================================

এই জিপ ফাইলটিতে উল্লাপাড়া প্রেসক্লাবের সম্পূর্ণ রেডি-টু-ইউজ ওয়েবসাইট রয়েছে।

ব্যবহার নির্দেশিকা (How to Use):
--------------------------------
১. অফলাইনে সরাসরি ব্রাউজারে খুলতে:
   - জিপ ফাইলটি আনজিপ (Extract) করুন।
   - আনজিপ করা ফোল্ডারের ভেতর "index.html" ফাইলটিতে ডাবল ক্লিক করুন।
   - যেকোনো ব্রাউজারে (Chrome, Edge, Firefox) সম্পূর্ণ ওয়েবসাইটটি ওপেন হবে।

২. যেকোনো ওয়েব হোস্টিংয়ে লাইভ করতে (cPanel, Hostinger, Vercel, Netlify):
   - এই ফোল্ডারের ভেতরের সমস্ত ফাইল ও ফোল্ডার (index.html, assets ফোল্ডার ও অন্যান্য ছবি) আপনার হোস্টিংয়ের public_html বা রুট ডিরেক্টরিতে আপলোড করুন।
   - কোনো ব্যাকএন্ড সার্ভার বা ডাটাবেজ কনফিগারেশনের প্রয়োজন নেই; এটি সম্পূর্ণ স্ট্যাটিক ও সুপার-ফাস্ট।

৩. লোকাল সার্ভারে টেস্ট করতে:
   - ফোল্ডারের ভেতর টার্মিনাল খুলে চালান:
     npx serve
     অথবা
     python3 -m http.server 8000

প্রয়োজনে যোগাযোগ:
উল্লাপাড়া প্রেসক্লাব, থানা সংলগ্ন সড়ক, উল্লাপাড়া, সিরাজগঞ্জ।
স্থাপিত: ১৯৭৮ | সুবর্ণজয়ন্তী ২০২৭
`;
  zip.file('README.txt', readmeContent);

  // Generate ZIP as a buffer
  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const zipOutputPath = path.join(publicDir, 'ullapara-pressclub-website.zip');
  fs.writeFileSync(zipOutputPath, zipBuffer);
  fs.writeFileSync(path.join(distDir, 'ullapara-pressclub-website.zip'), zipBuffer);
  console.log(`Successfully generated ZIP: ${zipOutputPath} (${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

  // Also copy dist/index.html to public/index-download.html so users can download standalone html directly
  const distIndex = path.join(distDir, 'index.html');
  if (fs.existsSync(distIndex)) {
    const standaloneHtml = fs.readFileSync(distIndex, 'utf8');
    fs.writeFileSync(path.join(publicDir, 'index-download.html'), standaloneHtml);
    fs.writeFileSync(path.join(distDir, 'index-download.html'), standaloneHtml);
    console.log('Successfully prepared index-download.html in public and dist directories.');
  }

  // ============================================================
  // GENERATE WORDPRESS THEME (ONE-CLICK INSTALLABLE THEME ZIP)
  // ============================================================
  console.log('Generating One-Click WordPress Theme ZIP archive...');
  const wpZip = new JSZip();
  const themeFolder = wpZip.folder('ullapara-pressclub');

  // 1. WordPress style.css (Required theme header)
  const wpStyleCss = `/*
Theme Name: Ullapara Press Club
Theme URI: https://ullaparapressclub.org
Author: Ullapara Press Club ICT Team
Author URI: https://ullaparapressclub.org
Description: অফিসিয়াল উল্লাপাড়া প্রেসক্লাব আধুনিক ডাইনামিক ওয়েবসাইট ও মিডিয়া পোর্টাল থিম। কোনো কনফিগারেশন ছাড়াই ওয়ার্ডপ্রেসে ১-ক্লিকে ইনস্টল ও চালু করুন।
Version: 2.0.0
Tested up to: 6.7
Requires at least: 5.6
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ullapara-pressclub
Tags: news, blog, bangla, press-club, responsive-layout, full-width-template
*/

/* Reset & root styles for seamless WordPress integration */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f8fafc;
}
#root {
  min-height: 100vh;
}
`;
  themeFolder.file('style.css', wpStyleCss);

  // 2. WordPress functions.php
  const wpFunctionsPhp = `<?php
/**
 * Ullapara Press Club Theme Functions & Admin Dashboard Integration
 *
 * @package Ullapara_Press_Club
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

function upc_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
}
add_action( 'after_setup_theme', 'upc_theme_setup' );

// Clean up standard generator meta
remove_action('wp_head', 'wp_generator');

/**
 * 1. Register "প্রেসক্লাব ড্যাশবোর্ড" in WordPress Admin Menu
 */
function upc_register_admin_menu() {
    add_menu_page(
        'প্রেসক্লাব ড্যাশবোর্ড',
        'প্রেসক্লাব ড্যাশবোর্ড',
        'manage_options',
        'pressclub-dashboard',
        'upc_render_dashboard_page',
        'dashicons-groups',
        3
    );

    add_submenu_page(
        'pressclub-dashboard',
        'ড্যাশবোর্ড ও ওভারভিউ',
        'ওভারভিউ',
        'manage_options',
        'pressclub-dashboard',
        'upc_render_dashboard_page'
    );

    add_submenu_page(
        'pressclub-dashboard',
        'সদস্য রেজিস্ট্রেশন আবেদন',
        'সদস্য আবেদন',
        'manage_options',
        'pressclub-applications',
        'upc_render_applications_page'
    );

    add_submenu_page(
        'pressclub-dashboard',
        'বিজ্ঞাপন ও গুগল অ্যাডসেন্স',
        'বিজ্ঞাপন ও অ্যাডসেন্স',
        'manage_options',
        'pressclub-ads',
        'upc_render_ads_page'
    );

    add_submenu_page(
        'pressclub-dashboard',
        'নিউজলেটার গ্রাহক তালিকা',
        'নিউজলেটার গ্রাহক',
        'manage_options',
        'pressclub-subscribers',
        'upc_render_subscribers_page'
    );

    add_submenu_page(
        'pressclub-dashboard',
        'সদস্য তালিকা ও কমিটি',
        'সদস্য তালিকা',
        'manage_options',
        'pressclub-members',
        'upc_render_members_page'
    );
}
add_action( 'admin_menu', 'upc_register_admin_menu' );

/**
 * Handle Admin Actions (Approve, Reject, Delete, Save Settings)
 */
function upc_handle_admin_actions() {
    if ( ! current_user_can('manage_options') ) return;

    // Handle CSV Export
    if ( isset($_GET['page']) && $_GET['page'] === 'pressclub-subscribers' && isset($_GET['action']) && $_GET['action'] === 'export_csv' ) {
        check_admin_referer('upc_export_subscribers');
        $subscribers = get_option('upc_newsletter_subscribers', array());
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="pressclub-newsletter-subscribers.csv"');
        echo "\\xEF\\xBB\\xBF"; // UTF-8 BOM for Excel
        $output = fopen('php://output', 'w');
        fputcsv($output, array('ID', 'Name', 'Email', 'Phone', 'Category', 'Subscribed At'));
        foreach ($subscribers as $s) {
            fputcsv($output, array(
                isset($s['id']) ? $s['id'] : '',
                isset($s['name']) ? $s['name'] : '',
                isset($s['email']) ? $s['email'] : '',
                isset($s['phone']) ? $s['phone'] : '',
                isset($s['category']) ? $s['category'] : '',
                isset($s['subscribedAt']) ? $s['subscribedAt'] : ''
            ));
        }
        fclose($output);
        exit;
    }

    // Handle Application Status (Approve / Reject / Delete)
    if ( isset($_POST['upc_app_action_nonce']) && wp_verify_nonce($_POST['upc_app_action_nonce'], 'upc_manage_app') ) {
        $app_id = sanitize_text_field($_POST['app_id']);
        $action = sanitize_text_field($_POST['app_action']);
        $apps = get_option('upc_member_applications', array());

        if ( $action === 'approve' ) {
            $members = get_option('upc_members', array());
            foreach ($apps as &$a) {
                if ($a['id'] === $app_id) {
                    $a['status'] = 'approved';
                    // Add to members list if not already
                    $members[] = array(
                        'id' => 'wp-mem-' . time(),
                        'name' => isset($a['fullName']) ? $a['fullName'] : (isset($a['name']) ? $a['name'] : 'সদস্য'),
                        'designation' => isset($a['designation']) ? $a['designation'] : 'সাধারণ সদস্য',
                        'media' => isset($a['mediaName']) ? $a['mediaName'] : (isset($a['media']) ? $a['media'] : 'গণমাধ্যম'),
                        'phone' => isset($a['phone']) ? $a['phone'] : '',
                        'photoUrl' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                        'category' => 'general',
                        'listType' => 'list2_general'
                    );
                    break;
                }
            }
            update_option('upc_member_applications', $apps);
            update_option('upc_members', $members);
            wp_safe_redirect( add_query_arg( array('page' => 'pressclub-applications', 'msg' => 'approved'), admin_url('admin.php') ) );
            exit;
        } elseif ( $action === 'reject' ) {
            foreach ($apps as &$a) {
                if ($a['id'] === $app_id) {
                    $a['status'] = 'rejected';
                    break;
                }
            }
            update_option('upc_member_applications', $apps);
            wp_safe_redirect( add_query_arg( array('page' => 'pressclub-applications', 'msg' => 'rejected'), admin_url('admin.php') ) );
            exit;
        } elseif ( $action === 'delete' ) {
            $new_apps = array();
            foreach ($apps as $a) {
                if ($a['id'] !== $app_id) $new_apps[] = $a;
            }
            update_option('upc_member_applications', $new_apps);
            wp_safe_redirect( add_query_arg( array('page' => 'pressclub-applications', 'msg' => 'deleted'), admin_url('admin.php') ) );
            exit;
        }
    }

    // Handle Ad Settings Save
    if ( isset($_POST['upc_save_ads_nonce']) && wp_verify_nonce($_POST['upc_save_ads_nonce'], 'upc_save_ads') ) {
        $ad_cfg = array(
            'enabled' => isset($_POST['enabled']) ? true : false,
            'adsenseClientId' => sanitize_text_field($_POST['adsenseClientId']),
            'adsenseAutoAds' => isset($_POST['adsenseAutoAds']) ? true : false,
            'adsenseHeaderSlot' => sanitize_text_field($_POST['adsenseHeaderSlot']),
            'adsenseInfeedSlot' => sanitize_text_field($_POST['adsenseInfeedSlot']),
            'adsenseSidebarSlot' => sanitize_text_field($_POST['adsenseSidebarSlot']),
            'customHeaderHtml' => wp_kses_post($_POST['customHeaderHtml']),
            'customInfeedHtml' => wp_kses_post($_POST['customInfeedHtml']),
            'customSidebarHtml' => wp_kses_post($_POST['customSidebarHtml']),
            'bannerPhone' => sanitize_text_field($_POST['bannerPhone']),
            'bannerEmail' => sanitize_email($_POST['bannerEmail']),
            'contactPerson' => sanitize_text_field($_POST['contactPerson'])
        );
        update_option('upc_ad_config', $ad_cfg);
        wp_safe_redirect( add_query_arg( array('page' => 'pressclub-ads', 'msg' => 'saved'), admin_url('admin.php') ) );
        exit;
    }

    // Handle Add Member
    if ( isset($_POST['upc_add_member_nonce']) && wp_verify_nonce($_POST['upc_add_member_nonce'], 'upc_add_member') ) {
        $members = get_option('upc_members', array());
        $members[] = array(
            'id' => 'wp-' . time(),
            'serialNumber' => count($members) + 1,
            'name' => sanitize_text_field($_POST['name']),
            'designation' => sanitize_text_field($_POST['designation']),
            'media' => sanitize_text_field($_POST['media']),
            'phone' => sanitize_text_field($_POST['phone']),
            'photoUrl' => !empty($_POST['photoUrl']) ? esc_url_raw($_POST['photoUrl']) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            'category' => sanitize_text_field($_POST['category']),
            'listType' => $_POST['category'] === 'executive' ? 'list1_executive' : 'list2_general'
        );
        update_option('upc_members', $members);
        wp_safe_redirect( add_query_arg( array('page' => 'pressclub-members', 'msg' => 'added'), admin_url('admin.php') ) );
        exit;
    }

    // Handle Delete Member
    if ( isset($_POST['upc_delete_member_nonce']) && wp_verify_nonce($_POST['upc_delete_member_nonce'], 'upc_delete_member') ) {
        $del_id = sanitize_text_field($_POST['member_id']);
        $members = get_option('upc_members', array());
        $new_members = array();
        foreach ($members as $m) {
            if ($m['id'] !== $del_id) $new_members[] = $m;
        }
        update_option('upc_members', $new_members);
        wp_safe_redirect( add_query_arg( array('page' => 'pressclub-members', 'msg' => 'deleted'), admin_url('admin.php') ) );
        exit;
    }
}
add_action( 'admin_init', 'upc_handle_admin_actions' );

/**
 * 2. Admin Page Renderers
 */

// Dashboard Overview Page
function upc_render_dashboard_page() {
    $apps = get_option('upc_member_applications', array());
    $subscribers = get_option('upc_newsletter_subscribers', array());
    $members = get_option('upc_members', array());
    $ad_cfg = get_option('upc_ad_config', array());

    $pending_count = 0;
    foreach ($apps as $a) {
        if (isset($a['status']) && $a['status'] === 'pending') $pending_count++;
    }
    ?>
    <div class="wrap">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #0d3b66;">
            🏛️ উল্লাপাড়া প্রেসক্লাব — প্রশাসনিক ড্যাশবোর্ড ও নিয়ন্ত্রণ কেন্দ্র
        </h1>
        <p style="color: #4b5563; font-size: 14px;">
            স্বাগতম! এই ড্যাশবোর্ড থেকে আপনি সদস্য আবেদন অনুমোদন, গুগল অ্যাডসেন্স ব্যানার, নিউজলেটার গ্রাহক তালিকা এবং ক্লাব পরিচালনা করতে পারবেন।
        </p>

        <!-- KPI Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 20px 0;">
            <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <span style="font-size: 12px; font-weight: bold; color: #2563eb; text-transform: uppercase;">অপেক্ষমাণ সদস্য আবেদন</span>
                <h2 style="font-size: 32px; font-weight: bold; margin: 8px 0; color: #1e3a8a;"><?php echo esc_html($pending_count); ?></h2>
                <a href="<?php echo esc_url(admin_url('admin.php?page=pressclub-applications')); ?>" class="button button-primary">আবেদন যাচাই করুন &rarr;</a>
            </div>

            <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <span style="font-size: 12px; font-weight: bold; color: #059669; text-transform: uppercase;">নিউজলেটার গ্রাহক</span>
                <h2 style="font-size: 32px; font-weight: bold; margin: 8px 0; color: #065f46;"><?php echo esc_html(count($subscribers)); ?></h2>
                <a href="<?php echo esc_url(admin_url('admin.php?page=pressclub-subscribers')); ?>" class="button">গ্রাহক তালিকা দেখুন &rarr;</a>
            </div>

            <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <span style="font-size: 12px; font-weight: bold; color: #d97706; text-transform: uppercase;">বিজ্ঞাপন ও অ্যাডসেন্স</span>
                <h2 style="font-size: 20px; font-weight: bold; margin: 14px 0; color: #92400e;">
                    <?php echo !empty($ad_cfg['enabled']) ? '🟢 সক্রিয় (Active)' : '⚪ নিষ্ক্রিয় (Disabled)'; ?>
                </h2>
                <a href="<?php echo esc_url(admin_url('admin.php?page=pressclub-ads')); ?>" class="button">অ্যাড কোড সেট করুন &rarr;</a>
            </div>

            <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <span style="font-size: 12px; font-weight: bold; color: #4f46e5; text-transform: uppercase;">মোট নিবন্ধিত সদস্য</span>
                <h2 style="font-size: 32px; font-weight: bold; margin: 8px 0; color: #3730a3;"><?php echo esc_html(count($members)); ?></h2>
                <a href="<?php echo esc_url(admin_url('admin.php?page=pressclub-members')); ?>" class="button">সদস্য পরিচালনা &rarr;</a>
            </div>
        </div>

        <!-- Shortcodes Guide Card -->
        <div style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; margin-top: 24px;">
            <h3 style="font-size: 16px; font-weight: bold; margin-top: 0; color: #0d3b66;">
                📌 ওয়ার্ডপ্রেস শর্টকোড সমূহ (যেকোনো পেজে ব্যবহারযোগ্য)
            </h3>
            <p style="color: #6b7280; font-size: 13px;">
                আপনি এই শর্টকোডগুলো যেকোনো ওয়ার্ডপ্রেস পেজ বা পোস্টে পেস্ট করে সরাসরি মডিউলগুলো বসাতে পারবেন:
            </p>
            <table class="widefat fixed striped" style="margin-top: 12px;">
                <thead>
                    <tr>
                        <th style="width: 250px;"><strong>শর্টকোড (Shortcode)</strong></th>
                        <th><strong>বিবরণ ও কার্যকারিতা</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>[pressclub_member_registration]</code></td>
                        <td>অনলাইন সদস্য সংগ্রহ ও আবেদন ফরম সরাসরি পেজে রেন্ডার করে।</td>
                    </tr>
                    <tr>
                        <td><code>[pressclub_newsletter]</code></td>
                        <td>পাঠক ও সাংবাদিকদের জন্য ইমেইল নিউজলেটার সাবস্ক্রিপশন বক্স।</td>
                    </tr>
                    <tr>
                        <td><code>[pressclub_adsense]</code></td>
                        <td>পোস্ট বা আর্টিকেলের ভেতর স্বয়ংক্রিয় গুগল অ্যাডসেন্স বা স্পন্সর ব্যানার প্রদর্শন।</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <?php
}

// Member Applications Page
function upc_render_applications_page() {
    $apps = get_option('upc_member_applications', array());
    ?>
    <div class="wrap">
        <h1 style="font-size: 22px; font-weight: bold; margin-bottom: 12px; color: #0d3b66;">
            📝 সদস্য রেজিস্ট্রেশন আবেদনসমূহ
        </h1>
        <p style="color: #6b7280; font-size: 13px;">
            ওয়েবসাইটের অনলাইন সদস্য সংগ্রহ ফরম থেকে জমা পড়া আবেদনসমূহ এখানে প্রদর্শিত হচ্ছে। এখান থেকে অনুমোদন বা বাতিল করতে পারবেন।
        </p>

        <?php if ( isset($_GET['msg']) && $_GET['msg'] === 'approved' ): ?>
            <div class="notice notice-success is-dismissible"><p>আবেদনটি সফলভাবে অনুমোদিত হয়েছে এবং সদস্য তালিকায় যুক্ত করা হয়েছে!</p></div>
        <?php elseif ( isset($_GET['msg']) && $_GET['msg'] === 'rejected' ): ?>
            <div class="notice notice-warning is-dismissible"><p>আবেদনটি বাতিল করা হয়েছে।</p></div>
        <?php elseif ( isset($_GET['msg']) && $_GET['msg'] === 'deleted' ): ?>
            <div class="notice notice-info is-dismissible"><p>আবেদনটি মুছে ফেলা হয়েছে।</p></div>
        <?php endif; ?>

        <table class="wp-list-table widefat fixed striped" style="margin-top: 16px;">
            <thead>
                <tr>
                    <th>তারিখ</th>
                    <th>নাম</th>
                    <th>কর্মরত মিডিয়া</th>
                    <th>পদবি ও ধরন</th>
                    <th>ফোন ও ইমেইল</th>
                    <th>স্ট্যাটাস</th>
                    <th style="width: 200px;">অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty($apps) ): ?>
                    <tr><td colspan="7" style="text-align: center; padding: 24px; color: #9ca3af;">এখনো কোনো সদস্য আবেদন জমা পড়েনি।</td></tr>
                <?php else: ?>
                    <?php foreach ( array_reverse($apps) as $app ): ?>
                        <tr>
                            <td><?php echo esc_html(isset($app['appliedAt']) ? $app['appliedAt'] : '-'); ?></td>
                            <td><strong><?php echo esc_html(isset($app['fullName']) ? $app['fullName'] : (isset($app['name']) ? $app['name'] : '-')); ?></strong></td>
                            <td><?php echo esc_html(isset($app['mediaName']) ? $app['mediaName'] : (isset($app['media']) ? $app['media'] : '-')); ?></td>
                            <td><?php echo esc_html(isset($app['designation']) ? $app['designation'] : '-'); ?> (<?php echo esc_html(isset($app['mediaType']) ? $app['mediaType'] : '-'); ?>)</td>
                            <td>
                                <div>📞 <?php echo esc_html(isset($app['phone']) ? $app['phone'] : '-'); ?></div>
                                <div style="color: #6b7280; font-size: 11px;">✉️ <?php echo esc_html(isset($app['email']) ? $app['email'] : '-'); ?></div>
                            </td>
                            <td>
                                <?php
                                $st = isset($app['status']) ? $app['status'] : 'pending';
                                if ($st === 'approved') echo '<span style="background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: bold;">অনুমোদিত</span>';
                                elseif ($st === 'rejected') echo '<span style="background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: bold;">বাতিল</span>';
                                else echo '<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: bold;">অপেক্ষমাণ</span>';
                                ?>
                            </td>
                            <td>
                                <form method="post" style="display: inline-block;">
                                    <?php wp_nonce_field('upc_manage_app', 'upc_app_action_nonce'); ?>
                                    <input type="hidden" name="app_id" value="<?php echo esc_attr($app['id']); ?>">
                                    <?php if ($st === 'pending'): ?>
                                        <button type="submit" name="app_action" value="approve" class="button button-small button-primary" style="margin-right: 4px;">অনুমোদন</button>
                                        <button type="submit" name="app_action" value="reject" class="button button-small" style="margin-right: 4px;">বাতিল</button>
                                    <?php endif; ?>
                                    <button type="submit" name="app_action" value="delete" class="button button-small" onclick="return confirm('মুছে ফেলতে চান?');">মুছুন</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

// AdSense & Ads Page
function upc_render_ads_page() {
    $ad_cfg = get_option('upc_ad_config', array(
        'enabled' => true,
        'adsenseClientId' => '',
        'adsenseAutoAds' => false,
        'adsenseHeaderSlot' => '',
        'adsenseInfeedSlot' => '',
        'adsenseSidebarSlot' => '',
        'customHeaderHtml' => '',
        'customInfeedHtml' => '',
        'customSidebarHtml' => '',
        'bannerPhone' => '০১৭১১-২২৩৩৪৪',
        'bannerEmail' => 'ads@ullaparapressclub.org',
        'contactPerson' => 'বিজ্ঞাপন ও বাণিজ্যিক বিভাগ'
    ));
    ?>
    <div class="wrap">
        <h1 style="font-size: 22px; font-weight: bold; margin-bottom: 12px; color: #0d3b66;">
            📢 বিজ্ঞাপন ও গুগল অ্যাডসেন্স (Google AdSense Settings)
        </h1>
        <p style="color: #6b7280; font-size: 13px;">
            সাইটের বিভিন্ন স্থানে গুগল অ্যাডসেন্স ব্যানার বা কাস্টম স্পন্সর বিজ্ঞাপন কোড বসাতে নিচের ফিল্ডগুলো পূরণ করে সেভ করুন।
        </p>

        <?php if ( isset($_GET['msg']) && $_GET['msg'] === 'saved' ): ?>
            <div class="notice notice-success is-dismissible"><p>বিজ্ঞাপন কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!</p></div>
        <?php endif; ?>

        <form method="post" style="max-width: 800px; background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb; margin-top: 16px;">
            <?php wp_nonce_field('upc_save_ads', 'upc_save_ads_nonce'); ?>

            <table class="form-table">
                <tr>
                    <th scope="row">বিজ্ঞাপন ব্যবস্থা সক্রিয় রাখুন</th>
                    <td>
                        <label>
                            <input type="checkbox" name="enabled" value="1" <?php checked(!empty($ad_cfg['enabled'])); ?>>
                            ওয়েবসাইটে সকল বিজ্ঞাপন স্লট প্রদর্শন করুন
                        </label>
                    </td>
                </tr>

                <tr>
                    <th scope="row">গুগল অ্যাডসেন্স পাবলিশার আইডি (Client ID)</th>
                    <td>
                        <input type="text" name="adsenseClientId" value="<?php echo esc_attr(isset($ad_cfg['adsenseClientId']) ? $ad_cfg['adsenseClientId'] : ''); ?>" placeholder="ca-pub-XXXXXXXXXXXXXXXX" class="regular-text">
                        <p class="description">আপনার গুগল অ্যাডসেন্স ক্লায়েন্ট আইডি লিখুন।</p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">হেডার ব্যানার স্লট আইডি (Header Slot)</th>
                    <td>
                        <input type="text" name="adsenseHeaderSlot" value="<?php echo esc_attr(isset($ad_cfg['adsenseHeaderSlot']) ? $ad_cfg['adsenseHeaderSlot'] : ''); ?>" placeholder="1234567890" class="regular-text">
                    </td>
                </tr>

                <tr>
                    <th scope="row">ইন-ফিড বা নিউজলেটার পরবর্তী স্লট আইডি</th>
                    <td>
                        <input type="text" name="adsenseInfeedSlot" value="<?php echo esc_attr(isset($ad_cfg['adsenseInfeedSlot']) ? $ad_cfg['adsenseInfeedSlot'] : ''); ?>" placeholder="0987654321" class="regular-text">
                    </td>
                </tr>

                <tr>
                    <th scope="row">সাইডবার বিজ্ঞাপন স্লট আইডি</th>
                    <td>
                        <input type="text" name="adsenseSidebarSlot" value="<?php echo esc_attr(isset($ad_cfg['adsenseSidebarSlot']) ? $ad_cfg['adsenseSidebarSlot'] : ''); ?>" placeholder="1122334455" class="regular-text">
                    </td>
                </tr>

                <tr>
                    <th scope="row">কাস্টম বিজ্ঞাপন HTML কোড (ঐচ্ছিক)</th>
                    <td>
                        <textarea name="customHeaderHtml" rows="3" class="large-text code" placeholder="<a href='...'><img src='...' /></a>"><?php echo esc_textarea(isset($ad_cfg['customHeaderHtml']) ? $ad_cfg['customHeaderHtml'] : ''); ?></textarea>
                        <p class="description">অ্যাডসেন্সের পরিবর্তে কোনো স্থানীয় স্পন্সরের ব্যানার বা স্ক্রিপ্ট দেখাতে চাইলে এখানে কোড পেস্ট করুন।</p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">বিজ্ঞাপন বুকিং হটলাইন ফোন</th>
                    <td>
                        <input type="text" name="bannerPhone" value="<?php echo esc_attr(isset($ad_cfg['bannerPhone']) ? $ad_cfg['bannerPhone'] : '০১৭১১-২২৩৩৪৪'); ?>" class="regular-text">
                    </td>
                </tr>

                <tr>
                    <th scope="row">বিজ্ঞাপন বিভাগ ইমেইল</th>
                    <td>
                        <input type="email" name="bannerEmail" value="<?php echo esc_attr(isset($ad_cfg['bannerEmail']) ? $ad_cfg['bannerEmail'] : 'ads@ullaparapressclub.org'); ?>" class="regular-text">
                    </td>
                </tr>
            </table>

            <p class="submit">
                <button type="submit" class="button button-primary" style="font-size: 14px; padding: 6px 18px;">সেটিংস সংরক্ষণ করুন</button>
            </p>
        </form>
    </div>
    <?php
}

// Newsletter Subscribers Page
function upc_render_subscribers_page() {
    $subscribers = get_option('upc_newsletter_subscribers', array());
    $csv_url = wp_nonce_url( admin_url('admin.php?page=pressclub-subscribers&action=export_csv'), 'upc_export_subscribers' );
    ?>
    <div class="wrap">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div>
                <h1 style="font-size: 22px; font-weight: bold; margin-bottom: 4px; color: #0d3b66;">
                    ✉️ নিউজলেটার গ্রাহক তালিকা
                </h1>
                <p style="color: #6b7280; font-size: 13px; margin: 0;">
                    ওয়েবসাইট থেকে সংগৃহীত ইমেইল ও মোবাইল নম্বরের তালিকা।
                </p>
            </div>
            <a href="<?php echo esc_url($csv_url); ?>" class="button button-primary">
                📥 CSV ফাইল হিসেবে ডাউনলোড করুন
            </a>
        </div>

        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>নিবন্ধনের তারিখ</th>
                    <th>পূর্ণ নাম</th>
                    <th>ইমেইল ঠিকানা</th>
                    <th>মোবাইল নম্বর</th>
                    <th>ক্যাটাগরি</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty($subscribers) ): ?>
                    <tr><td colspan="5" style="text-align: center; padding: 24px; color: #9ca3af;">এখনো কোনো গ্রাহক সাবস্ক্রাইব করেননি।</td></tr>
                <?php else: ?>
                    <?php foreach ( array_reverse($subscribers) as $sub ): ?>
                        <tr>
                            <td><?php echo esc_html(isset($sub['subscribedAt']) ? $sub['subscribedAt'] : '-'); ?></td>
                            <td><strong><?php echo esc_html(isset($sub['name']) ? $sub['name'] : '-'); ?></strong></td>
                            <td><a href="mailto:<?php echo esc_attr(isset($sub['email']) ? $sub['email'] : ''); ?>"><?php echo esc_html(isset($sub['email']) ? $sub['email'] : '-'); ?></a></td>
                            <td><?php echo esc_html(isset($sub['phone']) ? $sub['phone'] : '-'); ?></td>
                            <td>
                                <span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 99px; font-size: 11px;">
                                    <?php echo esc_html(isset($sub['category']) ? $sub['category'] : 'পাঠক'); ?>
                                </span>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

// Members Management Page
function upc_render_members_page() {
    $members = get_option('upc_members', array());
    ?>
    <div class="wrap">
        <h1 style="font-size: 22px; font-weight: bold; margin-bottom: 12px; color: #0d3b66;">
            👥 সদস্য ও কার্যনির্বাহী পরিষদ পরিচালনা
        </h1>

        <?php if ( isset($_GET['msg']) && $_GET['msg'] === 'added' ): ?>
            <div class="notice notice-success is-dismissible"><p>নতুন সদস্য সফলভাবে তালিকায় যোগ করা হয়েছে!</p></div>
        <?php elseif ( isset($_GET['msg']) && $_GET['msg'] === 'deleted' ): ?>
            <div class="notice notice-info is-dismissible"><p>সদস্য তালিকা থেকে বাদ দেওয়া হয়েছে।</p></div>
        <?php endif; ?>

        <!-- Add Member Form -->
        <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; margin: 16px 0;">
            <h3 style="margin-top: 0; font-size: 16px; color: #0d3b66;">+ নতুন সদস্য যোগ করুন</h3>
            <form method="post" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; align-items: end;">
                <?php wp_nonce_field('upc_add_member', 'upc_add_member_nonce'); ?>
                <div>
                    <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 4px;">নাম *</label>
                    <input type="text" name="name" required style="width: 100%;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 4px;">পদবি *</label>
                    <input type="text" name="designation" placeholder="যেমন: সহ-সভাপতি / সাধারণ সদস্য" required style="width: 100%;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 4px;">কর্মরত মিডিয়া *</label>
                    <input type="text" name="media" placeholder="যেমন: দৈনিক ইত্তেফাক" required style="width: 100%;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ফোন নম্বর</label>
                    <input type="text" name="phone" placeholder="০১৭১১-XXXXXX" style="width: 100%;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 4px;">ক্যাটাগরি</label>
                    <select name="category" style="width: 100%;">
                        <option value="executive">কার্যনির্বাহী পরিষদ</option>
                        <option value="general">সাধারণ সদস্য</option>
                    </select>
                </div>
                <div>
                    <button type="submit" class="button button-primary" style="width: 100%;">সদস্য হিসেবে যুক্ত করুন</button>
                </div>
            </form>
        </div>

        <!-- Members Table -->
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>ক্রমিক</th>
                    <th>সদস্যের নাম</th>
                    <th>পদবি</th>
                    <th>সংবাদমাধ্যম</th>
                    <th>ফোন নম্বর</th>
                    <th>ক্যাটাগরি</th>
                    <th style="width: 100px;">অ্যাকশন</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty($members) ): ?>
                    <tr><td colspan="7" style="text-align: center; padding: 24px; color: #9ca3af;">কাস্টম সদস্য তালিকা ফাঁকা। থিমের ডিফল্ট সদস্যবৃন্দ ফ্রন্টএন্ডে প্রদর্শিত হচ্ছে।</td></tr>
                <?php else: ?>
                    <?php foreach ( $members as $idx => $m ): ?>
                        <tr>
                            <td><?php echo esc_html($idx + 1); ?></td>
                            <td><strong><?php echo esc_html(isset($m['name']) ? $m['name'] : '-'); ?></strong></td>
                            <td><?php echo esc_html(isset($m['designation']) ? $m['designation'] : '-'); ?></td>
                            <td><?php echo esc_html(isset($m['media']) ? $m['media'] : '-'); ?></td>
                            <td><?php echo esc_html(isset($m['phone']) ? $m['phone'] : '-'); ?></td>
                            <td><?php echo (isset($m['category']) && $m['category'] === 'executive') ? 'কার্যনির্বাহী' : 'সাধারণ সদস্য'; ?></td>
                            <td>
                                <form method="post" style="display: inline;">
                                    <?php wp_nonce_field('upc_delete_member', 'upc_delete_member_nonce'); ?>
                                    <input type="hidden" name="member_id" value="<?php echo esc_attr($m['id']); ?>">
                                    <button type="submit" class="button button-small" onclick="return confirm('মুছে ফেলতে চান?');">মুছুন</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

/**
 * 3. Register REST API Endpoints for Seamless Frontend-Backend Communication
 */
function upc_register_rest_routes() {
    register_rest_route('pressclub/v1', '/applications', array(
        'methods' => 'POST',
        'callback' => 'upc_rest_submit_application',
        'permission_callback' => '__return_true'
    ));

    register_rest_route('pressclub/v1', '/subscribers', array(
        'methods' => 'POST',
        'callback' => 'upc_rest_submit_subscriber',
        'permission_callback' => '__return_true'
    ));

    register_rest_route('pressclub/v1', '/config', array(
        'methods' => 'GET',
        'callback' => 'upc_rest_get_config',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'upc_register_rest_routes');

function upc_rest_submit_application($request) {
    $params = $request->get_json_params();
    if (empty($params) || empty($params['fullName'])) {
        return new WP_Error('invalid_data', 'Missing required fields', array('status' => 400));
    }

    $apps = get_option('upc_member_applications', array());
    $new_app = array(
        'id' => isset($params['id']) ? sanitize_text_field($params['id']) : ('UPC-MEM-' . time()),
        'fullName' => sanitize_text_field($params['fullName']),
        'fatherName' => sanitize_text_field(isset($params['fatherName']) ? $params['fatherName'] : ''),
        'dob' => sanitize_text_field(isset($params['dob']) ? $params['dob'] : ''),
        'nid' => sanitize_text_field(isset($params['nid']) ? $params['nid'] : ''),
        'education' => sanitize_text_field(isset($params['education']) ? $params['education'] : ''),
        'presentAddress' => sanitize_textarea_field(isset($params['presentAddress']) ? $params['presentAddress'] : ''),
        'permanentAddress' => sanitize_textarea_field(isset($params['permanentAddress']) ? $params['permanentAddress'] : ''),
        'mediaName' => sanitize_text_field(isset($params['mediaName']) ? $params['mediaName'] : ''),
        'designation' => sanitize_text_field(isset($params['designation']) ? $params['designation'] : ''),
        'mediaType' => sanitize_text_field(isset($params['mediaType']) ? $params['mediaType'] : ''),
        'experienceYears' => sanitize_text_field(isset($params['experienceYears']) ? $params['experienceYears'] : ''),
        'phone' => sanitize_text_field(isset($params['phone']) ? $params['phone'] : ''),
        'email' => sanitize_email(isset($params['email']) ? $params['email'] : ''),
        'reportsSummary' => sanitize_textarea_field(isset($params['reportsSummary']) ? $params['reportsSummary'] : ''),
        'appliedAt' => sanitize_text_field(isset($params['appliedAt']) ? $params['appliedAt'] : date('d M, Y')),
        'status' => 'pending'
    );
    array_unshift($apps, $new_app);
    update_option('upc_member_applications', $apps);

    return rest_ensure_response(array('success' => true, 'id' => $new_app['id']));
}

function upc_rest_submit_subscriber($request) {
    $params = $request->get_json_params();
    if (empty($params) || empty($params['email'])) {
        return new WP_Error('invalid_data', 'Email required', array('status' => 400));
    }

    $subscribers = get_option('upc_newsletter_subscribers', array());
    $email = sanitize_email($params['email']);

    foreach ($subscribers as $s) {
        if (isset($s['email']) && strtolower($s['email']) === strtolower($email)) {
            return rest_ensure_response(array('success' => true, 'exists' => true));
        }
    }

    $new_sub = array(
        'id' => isset($params['id']) ? sanitize_text_field($params['id']) : ('SUB-' . time()),
        'name' => sanitize_text_field(isset($params['name']) ? $params['name'] : ''),
        'email' => $email,
        'phone' => sanitize_text_field(isset($params['phone']) ? $params['phone'] : ''),
        'category' => sanitize_text_field(isset($params['category']) ? $params['category'] : 'reader'),
        'subscribedAt' => sanitize_text_field(isset($params['subscribedAt']) ? $params['subscribedAt'] : date('d M, Y'))
    );
    array_unshift($subscribers, $new_sub);
    update_option('upc_newsletter_subscribers', $subscribers);

    return rest_ensure_response(array('success' => true));
}

function upc_rest_get_config() {
    return rest_ensure_response(upc_get_theme_frontend_config());
}

/**
 * 4. Helper to provide config to Frontend
 */
function upc_get_theme_frontend_config() {
    $apps = get_option('upc_member_applications', array());
    $subs = get_option('upc_newsletter_subscribers', array());
    $members = get_option('upc_members', array());
    $ad_cfg = get_option('upc_ad_config', array());

    return array(
        'adConfig' => !empty($ad_cfg) ? $ad_cfg : null,
        'memberApplications' => !empty($apps) ? $apps : null,
        'subscribers' => !empty($subs) ? $subs : null,
        'members' => !empty($members) ? $members : null
    );
}

/**
 * 5. Shortcodes
 */
add_shortcode('pressclub_member_registration', function() {
    return '<div class="upc-shortcode-recruitment" style="margin: 20px 0; text-align: center;"><a href="#recruitment" onclick="if(window.PRESSCLUB_OPEN_RECRUITMENT) window.PRESSCLUB_OPEN_RECRUITMENT(); return false;" class="button button-primary" style="background:#0d3b66; color:#fff; padding:12px 24px; border-radius:12px; font-weight:bold; text-decoration:none; display:inline-block;">📝 অনলাইনে প্রেসক্লাব সদস্যপদের আবেদন করুন</a></div>';
});

add_shortcode('pressclub_newsletter', function() {
    return '<div class="upc-shortcode-newsletter" style="margin: 20px 0; padding: 20px; background: #0c2f52; border-radius: 16px; color: #fff; text-align: center;"><h3 style="color:#fff; margin-top:0;">প্রেসক্লাব নিউজলেটার</h3><p style="color:#bfdbfe; font-size:13px;">প্রেস বিজ্ঞপ্তি ও নোটিশ সরাসরি ইমেইলে পেতে সাবস্ক্রাইব করুন।</p></div>';
});

add_shortcode('pressclub_adsense', function() {
    $ad_cfg = get_option('upc_ad_config', array());
    if ( ! empty($ad_cfg['customInfeedHtml']) ) {
        return '<div class="upc-shortcode-ad" style="margin: 16px 0; text-align:center;">' . $ad_cfg['customInfeedHtml'] . '</div>';
    }
    if ( ! empty($ad_cfg['adsenseClientId']) && ! empty($ad_cfg['adsenseInfeedSlot']) ) {
        return '<div class="upc-shortcode-ad" style="margin: 16px 0; text-align:center;"><ins class="adsbygoogle" style="display:block" data-ad-client="' . esc_attr($ad_cfg['adsenseClientId']) . '" data-ad-slot="' . esc_attr($ad_cfg['adsenseInfeedSlot']) . '" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>';
    }
    return '<div style="background:#fffbeb; border:1px dashed #f59e0b; padding:12px; text-align:center; color:#92400e; font-size:12px; border-radius:8px;">📢 বিজ্ঞাপন স্লট [প্রেসক্লাব ড্যাশবোর্ড থেকে কোড বসান]</div>';
});
`;
  themeFolder.file('functions.php', wpFunctionsPhp);

  // Read index.html from dist to extract CSS and JS asset names
  let distHtml = '';
  if (fs.existsSync(distIndex)) {
    distHtml = fs.readFileSync(distIndex, 'utf8');
  }

  // Find asset tags in distHtml
  const cssMatches = [...distHtml.matchAll(/<link\s+[^>]*rel="stylesheet"[^>]*href="\/assets\/([^"]+)"[^>]*>/gi)];
  const jsMatches = [...distHtml.matchAll(/<script\s+[^>]*type="module"[^>]*src="\/assets\/([^"]+)"[^>]*><\/script>/gi)];

  // 3. WordPress header.php
  let wpHeaderPhp = `<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <meta name="description" content="১৯৭৭ সাল থেকে সিরাজগঞ্জ প্রেসক্লাব ও উল্লাপাড়া সাংবাদিকতার ঐতিহ্যবাহী প্রতিষ্ঠান উল্লাপাড়া প্রেসক্লাব। সংবাদপত্র ও বস্তুনিষ্ঠ গণমাধ্যম চর্চায় নিয়োজিত। সুবর্ণজয়ন্তী ২০২৭ (১৯৭৭-২০২৭)।">
  <meta name="keywords" content="উল্লাপাড়া সাংবাদিকতা, সিরাজগঞ্জ প্রেসক্লাব, সংবাদপত্র, উল্লাপাড়া প্রেসক্লাব, Ullapara Press Club, সিরাজগঞ্জ সাংবাদিক, প্রেস বিজ্ঞপ্তি, বাংলা সংবাদপত্র, সিরাজগঞ্জ খবর, মিডিয়া পোর্টাল">
  <meta name="author" content="উল্লাপাড়া প্রেসক্লাব আইসিটি সেল">
  <link rel="icon" type="image/png" href="<?php echo esc_url( get_template_directory_uri() ); ?>/logo.png">
  <link rel="apple-touch-icon" href="<?php echo esc_url( get_template_directory_uri() ); ?>/logo.png">
  <title><?php wp_title('|', true, 'right'); ?> <?php bloginfo('name'); ?> - উল্লাপাড়া প্রেসক্লাব</title>
  <link rel="stylesheet" href="<?php echo esc_url( get_stylesheet_uri() ); ?>">
`;

  cssMatches.forEach(match => {
    const filename = match[1];
    wpHeaderPhp += `  <link rel="stylesheet" crossorigin href="<?php echo esc_url( get_template_directory_uri() . '/assets/' . '${filename}' ); ?>">\n`;
  });

  wpHeaderPhp += `  <!-- WordPress Backend Config Injection for React App -->
  <script>
    window.PRESSCLUB_WP_CONFIG = <?php echo wp_json_encode( upc_get_theme_frontend_config() ); ?>;
  </script>

  <?php
  // Inject Google AdSense Script if client ID is configured
  $ad_cfg = get_option('upc_ad_config', array());
  if ( ! empty($ad_cfg['adsenseClientId']) && ! empty($ad_cfg['enabled']) ) {
      echo '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' . esc_attr($ad_cfg['adsenseClientId']) . '" crossorigin="anonymous"></script>' . "\\n";
  }
  ?>

  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
`;
  themeFolder.file('header.php', wpHeaderPhp);

  // 4. WordPress index.php
  const wpIndexPhp = `<?php
/**
 * Main Template File
 *
 * @package Ullapara_Press_Club
 */

get_header();
?>

<div id="root">
  <!-- React App Mount Point -->
</div>

<?php
get_footer();
`;
  themeFolder.file('index.php', wpIndexPhp);

  // 5. WordPress footer.php
  let wpFooterPhp = ``;
  jsMatches.forEach(match => {
    const filename = match[1];
    wpFooterPhp += `<script type="module" crossorigin src="<?php echo esc_url( get_template_directory_uri() . '/assets/' . '${filename}' ); ?>"></script>\n`;
  });
  wpFooterPhp += `<?php wp_footer(); ?>
</body>
</html>
`;
  themeFolder.file('footer.php', wpFooterPhp);

  // 6. Copy assets folder into WordPress theme
  const distAssetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(distAssetsDir)) {
    const themeAssetsFolder = themeFolder.folder('assets');
    const assetFiles = fs.readdirSync(distAssetsDir);
    for (const assetFile of assetFiles) {
      const assetPath = path.join(distAssetsDir, assetFile);
      if (fs.statSync(assetPath).isFile()) {
        themeAssetsFolder.file(assetFile, fs.readFileSync(assetPath));
      }
    }
  }

  // 7. Copy public images into WordPress theme root & create screenshot.png
  const publicEntries = fs.readdirSync(publicDir);
  for (const pFile of publicEntries) {
    if (pFile.endsWith('.zip') || pFile.endsWith('.html')) continue;
    const pPath = path.join(publicDir, pFile);
    if (fs.existsSync(pPath) && fs.statSync(pPath).isFile()) {
      const fileData = fs.readFileSync(pPath);
      themeFolder.file(pFile, fileData);

      // If building.jpg or main_building_ullapara_press_club.jpg exists, make screenshot.png for WP theme dashboard
      if (pFile === 'main_building_ullapara_press_club.jpg' || pFile === 'building.jpg') {
        themeFolder.file('screenshot.png', fileData);
      }
    }
  }

  // 8. Add WordPress theme instructions README
  const wpReadmeContent = `=====================================================
উল্লাপাড়া প্রেসক্লাব - ১-ক্লিকে ইনস্টলযোগ্য ওয়ার্ডপ্রেস থিম
Ullapara Press Club - One-Click WordPress Theme
=====================================================

ওয়ার্ডপ্রেসে যেভাবে ইনস্টল করবেন (How to Install in WordPress):
--------------------------------------------------------------
১. আপনার ওয়ার্ডপ্রেস অ্যাডমিন প্যানেলে লগইন করুন (যেমন: yoursite.com/wp-admin)।
২. বামপাশের মেনু থেকে Appearance > Themes-এ যান।
৩. উপরে "Add New Theme" বাটনে ক্লিক করুন।
৪. এরপর "Upload Theme" বাটনে ক্লিক করে এই "ullapara-pressclub-wp-theme.zip" ফাইলটি সিলেক্ট করুন।
৫. "Install Now" বাটনে ক্লিক করুন।
৬. ইনস্টলেশন শেষে "Activate" বাটনে ক্লিক করুন।

ব্যাস! আপনার ওয়ার্ডপ্রেস ওয়েবসাইটে সাথে সাথে আধুনিক উল্লাপাড়া প্রেসক্লাব ওয়েবসাইটটি হুবহু একই রূপে সক্রিয় হয়ে যাবে। আপনার পূর্বের কোনো প্লাগিন বা সেটিংস ক্ষতিগ্রস্ত হবে না।

বৈশিষ্ট্য:
- শতভাগ রেসপন্সিভ (মোবাইল, ট্যাবলেট ও ডেস্কটপ ফ্রেন্ডলি)
- দ্রুতগতির লাইটওয়েট আর্কিটেকচার
- অভ্যন্তরীণ অ্যাডমিন পোর্টাল (ডিফল্ট পিন: 1977)
- নোটিশ বোর্ড, সুবর্ণজয়ন্তী কর্নার, কার্যনির্বাহী পরিষদ, নাগরিক অভিযোগ ও মিডিয়া গ্যালারি।
`;
  themeFolder.file('README.txt', wpReadmeContent);

  // Generate WP Theme ZIP buffer
  const wpZipBuffer = await wpZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const wpZipOutputPath = path.join(publicDir, 'ullapara-pressclub-wp-theme.zip');
  fs.writeFileSync(wpZipOutputPath, wpZipBuffer);
  fs.writeFileSync(path.join(distDir, 'ullapara-pressclub-wp-theme.zip'), wpZipBuffer);
  console.log(`Successfully generated WordPress Theme ZIP: ${wpZipOutputPath} (${(wpZipBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

generateDownloadableZip().catch(err => {
  console.error('Error creating ZIP:', err);
  process.exit(1);
});
