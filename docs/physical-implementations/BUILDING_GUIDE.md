# Physical Implementation Guide
## Building Sustainable AI Prototypes in the Real World

This guide provides step-by-step instructions for building physical installations of the sustainable AI prototypes.

---

## 🪞 1. Magic Mirror / Reflection Station

### Overview
An interactive display that shows employees their environmental impact when they approach.

### Option A: Budget-Friendly (€300-500)

**Components:**
- 27" LED Monitor (1920x1080) - €150-200
- Raspberry Pi 4 (4GB) + Case - €80-100
- USB Webcam (1080p) - €30-50
- HDMI Cable - €10
- Power Supply & Cables - €20
- Optional: Decorative Frame - €30-50

**Assembly Steps:**

1. **Monitor Setup**
   - Remove monitor stand/base
   - Test display works with Raspberry Pi

2. **Raspberry Pi Configuration**
   ```bash
   # Install Raspberry Pi OS
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install dependencies
   sudo apt install chromium-browser unclutter -y

   # Clone web app
   git clone [your-repo-url]
   cd prototypes/magic-mirror

   # Install Node.js if needed
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs

   # Start server
   npm install
   npm start
   ```

3. **Webcam Integration**
   - Connect webcam to USB port
   - Test with: `cheese` or `fswebcam test.jpg`
   - Configure face detection in web app

4. **Kiosk Mode**
   ```bash
   # Edit autostart
   nano ~/.config/lxsession/LXDE-pi/autostart

   # Add these lines:
   @xset s off
   @xset -dpms
   @xset s noblank
   @chromium-browser --kiosk --app=http://localhost:3000
   ```

5. **Mounting**
   - Wall mount the monitor at eye level (150-160cm height)
   - Raspberry Pi can be attached to back of monitor
   - Run power cable through wall conduit for clean look

**Optional Enhancements:**
- LED strip around frame (react to user activity)
- Motion sensor to wake display
- RFID/NFC reader for badge login

### Option B: Premium Two-Way Mirror (€800-1,200)

**Additional Components:**
- Two-way acrylic mirror sheet (custom size) - €100-200
- Wooden frame materials - €50-100
- Black backing material - €20
- LED light strips - €30-50

**Assembly Steps:**

1. **Frame Construction**
   - Build wooden frame sized for monitor + 10cm borders
   - Create recess for monitor (depth = monitor thickness)
   - Paint frame (black or dark wood finish)

2. **Mirror Installation**
   - Cut two-way mirror to size (or order pre-cut)
   - Clean thoroughly
   - Mount in frame over monitor

3. **Electronics Integration**
   - Set monitor brightness to 100%
   - Install black backing behind monitor
   - Ensure no light leaks from sides
   - Wire webcam above mirror (small hole or edge mount)

4. **Calibration**
   - Test in intended location
   - Adjust ambient lighting for best mirror effect
   - Tweak monitor brightness if needed

**Tips:**
- Darker room = better mirror effect
- Use high-brightness monitor (300+ cd/m²)
- Test mirror quality before full assembly

---

## 🌲 2. Digital Forest Wall Display

### Overview
Large-screen visualization showing real-time sustainable AI impact as a growing forest.

### Standard Installation (€2,000-5,000)

**Components:**
- 65" 4K LED Display - €800-1,500
- Media Player (Intel NUC or equivalent) - €400-600
- VESA Wall Mount (heavy-duty) - €100-200
- Network Cable (Cat6, 15m) - €30
- Power Management - €50
- Optional: Sound System - €200-400
- Optional: Ambient LED Strips - €100

**Installation Steps:**

1. **Site Preparation**
   ```
   Requirements:
   - Wall load capacity: >50kg
   - Power outlet nearby (or install new)
   - Network port or WiFi
   - Minimum viewing distance: 2-3 meters
   - Ambient light control
   ```

2. **Wall Mounting**
   - Locate wall studs
   - Mark mounting points
   - Drill pilot holes
   - Install wall mount bracket
   - Hang display (2-person job!)
   - Level and secure

3. **Computer Setup**
   ```bash
   # Install Ubuntu/Windows
   # Install Chrome/Firefox
   # Set to auto-start browser in kiosk mode

   # For Ubuntu:
   sudo apt install chromium-browser unclutter

   # Create autostart script:
   nano ~/.config/autostart/forest.desktop

   [Desktop Entry]
   Type=Application
   Exec=chromium-browser --kiosk --app=http://localhost:8080
   Hidden=false
   NoDisplay=false
   X-GNOME-Autostart-enabled=true
   Name=Digital Forest
   ```

4. **Deploy Web App**
   ```bash
   # Copy forest files
   cd /opt
   sudo git clone [repo-url] sustainable-ai
   cd sustainable-ai/prototypes/digital-forest

   # Setup simple HTTP server
   sudo npm install -g http-server
   http-server -p 8080

   # Create systemd service for auto-start
   sudo nano /etc/systemd/system/forest.service

   [Unit]
   Description=Digital Forest Display
   After=network.target

   [Service]
   Type=simple
   User=root
   WorkingDirectory=/opt/sustainable-ai/prototypes/digital-forest
   ExecStart=/usr/bin/http-server -p 8080
   Restart=always

   [Install]
   WantedBy=multi-user.target

   # Enable service
   sudo systemctl enable forest.service
   sudo systemctl start forest.service
   ```

5. **Cable Management**
   - Use cable raceways/conduits
   - Hide cables behind display
   - Bundle and secure excess cables

6. **Ambient Enhancement**
   - Install LED strips around frame
   - Connect to Arduino/ESP32 for reactive lighting
   - Sync colors with forest health

### Premium LED Wall (4K - 130" display)

**Components:**
- 2x2 LED Panel Grid (each 65") - €3,200-6,000
- Video Wall Controller - €500-800
- Professional Mount System - €300-500

**Considerations:**
- Requires professional installation
- Higher power consumption (prepare electrical)
- Spectacular visual impact
- Ideal for main lobby/atrium

---

## 🎯 3. Prompt Coach Station

### Overview
Interactive kiosk for learning efficient prompt engineering.

**Components:**
- 32" Touchscreen Monitor (vertical) - €300-500
- Mini PC (Intel NUC/Raspberry Pi 4) - €80-400
- Kiosk Stand or Wall Mount - €100-200
- Keyboard (optional, wireless) - €30-50
- Total: €500-1,150

**Assembly:**

1. **Display Configuration**
   - Set monitor to portrait orientation
   - Adjust display settings in OS
   - Test touch functionality

2. **Software Setup**
   ```bash
   # Install web app
   # Configure for portrait mode
   # Enable on-screen keyboard

   # CSS media query for portrait:
   @media (orientation: portrait) {
     /* Optimized layout */
   }
   ```

3. **Kiosk Enclosure** (DIY Option)
   - Build simple wooden stand
   - Include shelf for keyboard
   - Cable routing
   - Lockable back panel

4. **Placement Strategy**
   - High-traffic areas
   - Near IT help desk
   - Break rooms
   - Meeting room hallways

---

## 🎮 4. Prompt Efficiency Game Station

### Overview
Interactive gaming setup for learning prompt optimization through gameplay.

**Components:**
- 42" 4K Monitor (horizontal or table-mount) - €400-600
- Gaming PC or High-Performance NUC - €600-1,000
- Mechanical Keyboard - €100-150
- Gaming Mouse - €50-80
- Comfortable Seating - €200-400
- RGB LED Strips - €30-50
- Headphones (optional) - €50-100
- Total: €1,430-2,380

**Setup:**

1. **Gaming Corner Design**
   - Corner location in innovation lab/break room
   - Good lighting
   - Comfortable temperature
   - Nearby power strips

2. **Visual Appeal**
   - LED strips that react to game events
   - Leaderboard display above main screen
   - Trophy/badge display case
   - Motivational posters

3. **Software Configuration**
   - Install game web app
   - Setup auto-login
   - Configure leaderboard sync
   - Test multiplayer features

4. **Social Elements**
   - Monthly tournament schedule poster
   - Prize announcement board
   - Photo wall of winners
   - QR codes for mobile participation

---

## 📊 5. Sustainability Kiosk (GAIA Access Point)

### Overview
Self-service station for accessing sustainability dashboard and printing reports.

**Components:**
- 27" Touchscreen Display - €300-500
- Raspberry Pi or Mini PC - €80-200
- RFID/NFC Reader - €40-80
- Thermal Printer (optional) - €150-250
- Kiosk Enclosure - €200-400
- Total: €770-1,430

**Features:**
- Badge-based login
- Personal dashboard view
- Print sustainability reports
- Educational content carousel
- Quick quiz access

**Placement:**
- HR department
- IT help desk
- Cafeteria/break room
- Building entrance

---

## 🖥️ 6. Carbon Router Dashboard Display

### Overview
Real-time visualization of AI query routing and carbon optimization.

**Components:**
- 55" Display - €500-800
- Server-Class Hardware (or Cloud VM) - €800-1,500
- Network Integration Hardware - €100-200
- Professional Display Mount - €150-300
- Total: €1,550-2,800

**Setup Location:**
- IT Department/NOC
- Server Room (visible window)
- Executive Floor (transparency)

**Display Content:**
- Real-time routing decisions
- Global carbon intensity map
- Savings counter
- Queue visualization
- Cost savings metrics

---

## 🔧 General Tips for All Installations

### Power Management
```bash
# Prevent screen sleep (Linux)
xset s off
xset -dpms
xset s noblank

# Windows: Power Options -> Never sleep
```

### Network Reliability
- Use wired Ethernet when possible
- Configure static IP addresses
- Setup VPN if accessing external APIs
- Implement local caching for offline resilience

### Maintenance Schedule
- **Daily**: Visual check, reboot if frozen
- **Weekly**: Clean screens, check connections
- **Monthly**: Software updates, backup data
- **Quarterly**: Deep clean, hardware inspection

### Security
- Disable unnecessary services
- Firewall configuration
- Regular security updates
- Physical access control (locked cabinets)

### Accessibility
- Screen height: 100-170cm (accommodate wheelchair users)
- Audio alternatives for visual content
- High-contrast modes
- Text size adjustments

---

## 💰 Budget Summary

| Installation | Budget Option | Premium Option |
|---|---|---|
| Magic Mirror | €300-500 | €800-1,200 |
| Digital Forest Wall | €2,000-3,000 | €4,000-10,000 |
| Prompt Coach Station | €500-800 | €1,000-1,500 |
| Game Station | €1,400-2,000 | €2,500-3,500 |
| Sustainability Kiosk | €600-1,000 | €1,200-2,000 |
| Carbon Router Display | €1,500-2,500 | €2,500-4,000 |

**Total for Complete Setup:**
- Minimum: €6,300
- Mid-Range: €12,000
- Premium: €20,000+

---

## 📋 Pre-Installation Checklist

### Site Survey
- [ ] Wall load capacity verified
- [ ] Power outlets available (or installation planned)
- [ ] Network connectivity confirmed
- [ ] Ambient lighting assessed
- [ ] Viewing angles checked
- [ ] Accessibility requirements met
- [ ] Fire safety compliance verified

### Hardware Preparation
- [ ] All components ordered and received
- [ ] Hardware tested before installation
- [ ] Software pre-loaded and tested
- [ ] Backup power plan (UPS if critical)
- [ ] Mounting hardware appropriate for wall type

### Software Readiness
- [ ] Web apps deployed and accessible
- [ ] Database connections tested
- [ ] Kiosk mode configured
- [ ] Auto-start scripts working
- [ ] Backup/restore procedures documented

### Documentation
- [ ] Installation manual created
- [ ] Maintenance schedule defined
- [ ] Troubleshooting guide prepared
- [ ] User instructions posted nearby
- [ ] IT support contact information visible

---

## 🚨 Troubleshooting

### Display Not Turning On
1. Check power connections
2. Verify display input source
3. Test with different device
4. Check display settings (power save mode)

### Touch Not Responding
1. Recalibrate touchscreen
2. Check USB connection
3. Update touch drivers
4. Test with on-screen keyboard

### Web App Not Loading
1. Check network connection
2. Verify web server running
3. Check firewall settings
4. Review application logs
5. Clear browser cache

### Performance Issues
1. Close unnecessary applications
2. Check CPU/RAM usage
3. Update graphics drivers
4. Reduce animation complexity
5. Consider hardware upgrade

---

## 📞 Support Resources

**Internal:**
- IT Helpdesk: ext. 2400
- Facilities Management: ext. 3100
- Sustainability Team: ext. 2750

**External:**
- Hardware Vendor Support
- Software Development Team (if contracted)
- Installation Contractors

**Documentation:**
- Technical specs in `/docs/technical/`
- User guides in `/docs/user-guides/`
- Video tutorials: [internal portal]

---

## 🎓 Training & Onboarding

### For IT Staff
- Hardware maintenance procedures
- Software update processes
- Troubleshooting common issues
- Security best practices

### For End Users
- How to use each installation
- Interpreting sustainability metrics
- Earning credits and achievements
- Reporting issues

### For Management
- Reading dashboard analytics
- Understanding ROI metrics
- Strategic decision support
- Compliance reporting

---

**Made with 💚 by the Sustainable AI Team**
**Last Updated: November 2025**
