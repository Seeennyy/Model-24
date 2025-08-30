# Hydrogen Factory Simulation — Test Scenarios Checklist

Use this file as a structured checklist to verify the app end-to-end. Mark pass/fail and add notes where behavior diverges. Share the updated file or the list of failed IDs back to me.

## Legend
- [ ] Not tested
- [✅] Passing
- [❌] Failing

---

## A. Environment & Page Load
1. [✅ ] A-1 Open `client/index.html` in a browser (or via `npm run dev` if applicable) and confirm:
   - Loading screen shows and progresses
   - No blocking red errors in console after load (informational missing optional modules is okay)
2. [ ] A-2 Verify global classes detected (see console verification block at end of index.html)
3. [✅ ] A-3 Confirm horizontal scrollbar visible on the tab bar and can scroll to see all tabs

Expected: App shows header, viewport on left, control panel on right; tabs visible with horizontal scroll; no fatal errors.

---

## B. 3D Viewport & Camera (This section has major problems: I can't differentiate between things, I can't switch camera angles, there are random dots, the 3d is not representative at all, major problems are in this section)
1. [ ] B-1 3D scene renders with equipment clusters and lighting
2. [ ] B-2 Camera buttons:
   - [ ] Reset View centers scene
   - [ ] Top, Side, Isometric adjust view smoothly
3. [ ] B-3 Interactions:
   - [ ] Hover highlight toggles on equipment
   - [ ] Click selects equipment (see console log for selection)
4. [ ] B-4 Resize window: renderer resizes to maintain aspect


Expected: Stable frame-rate; camera controls responsive; selection/hover works; resizing adjusts canvas.

---

## C. Tabs & Focus Navigation
For each tab button verify the camera focuses relevant area (if implemented) and the tab content appears. (The camera is not connected to the relevant part when you choose the system, there is no focus navigation at all)
1. [ ] C-1 Overview
2. [ ] C-2 Water System
3. [ ] C-3 Electrolysis
4. [ ] C-4 Purification
5. [ ] C-5 Compression
6. [ ] C-6 Storage
7. [ ] C-7 Power
8. [ ] C-8 Maintenance

Expected: Active tab visually highlighted; corresponding panel content visible; camera jumps to that system (if supported yet).

---

## D. Factory Lifecycle Controls
1. [ ✅] D-1 Click Start Factory
   - Start button disables, Emergency Stop enables
   - Metrics begin updating (production/efficiency)
   - Visual flows/particles animate
2. [ ✅] D-2 Click Emergency Stop
   - Start re-enables, Emergency Stop disables
   - Metrics freeze/zero where applicable
3. [ ✅] D-3 Click Start again to verify repeatability

Expected: No errors; state toggles are consistent across multiple cycles.

---

## E. Per-System Controls
Test each panel’s buttons; verify system status text and any visual change in the 3D. all of the following is not . Even the buttons u press buttons, they don't have any difference when u press buttons: Keep in mind the systems should be acccessabile and connected.
1. [ ] E-1 Water System
   - [ ] Start Water System -> status transitions to running; water consumption > 0
   - [ ] Stop Water System -> status offline; water consumption 0
   - [ ] Maintenance Mode -> status maintenance; visual state adjusts
2. [ ] E-2 Electrolysis
   - [ ] Start Stack -> status running; voltage/current/temperature populated; production > 0
   - [ ] Ramp Up -> gradual increase in production/current; efficiency trend adjusts
   - [ ] Stop Stack -> values return toward baseline/zero
3. [ ] E-3 Purification
   - [ ] Start -> status running
   - [ ] Stop -> status offline
4. [ ] E-4 Compression
   - [ ] Start -> status running
   - [ ] Stop -> status offline
5. [ ] E-5 Storage
   - [ ] Start -> status running
   - [ ] Stop -> status offline
6. [ ] E-6 Power
   - [ ] Start -> status running; power consumption reflects expected value
   - [ ] Stop -> returns to 0

Expected: Button click produces immediate UI feedback (status text and, where implemented, 3D color/animation changes).

---

## F. Settings & Difficulty: when I press on settings, there is nothing happen, the button is not working in first place
1. [ ] F-1 Open Settings; verify dialog shows and can be closed
2. [ ] F-2 Simulation Speed slider:
   - Move to 2x/0.5x and confirm metric update cadence changes (faster/slower)
3. [ ] F-3 Difficulty Level:
   - Switch among Trainee/Operator/Expert/Master and confirm internal failure rate setting updates (log)
4. [ ] F-4 Failure Rate slider:
   - Move from 100% to lower/higher; run for 1–2 minutes and observe if failures trigger more/less often (see console + any visual alarms)

Expected: Settings affect simulation pacing and failure probabilities (some effects may be observable via logs/metrics).

---

## G. Metrics & Charts
1. [✅ ] G-1 Overview metrics update while running (production, efficiency, power, water)
2. [ ] G-2 Trends: Not working
   - Production Trend and Efficiency Over Time receive periodic points (per the sampling cadence in code)

Expected: No NaN/undefined values; charts render without errors.

---

## H. Alerts & Errors: Not working bec the buttons are not working in first place
1. [ ] H-1 Trigger a user-visible alert (e.g., start/stop success)
2. [ ] H-2 Simulated failures (if any triggered) raise alerts and/or 3D indicators
3. [ ] H-3 Try invalid sequences (e.g., stop when already offline) -> no crash; graceful message

Expected: Alerts appear in top-right; no blocking modals unless expected; console free of unhandled exceptions.

---

## I. Layout & Accessibility
1. [ ✅] I-1 Horizontal tab scroll appears when tabs overflow
2. [ ] I-2 Control panel remains fixed width; no overlap with 3D viewport
3. [ ] I-3 Keyboard nav:
   - Tab through header buttons and tab bar
   - Press Enter/Space to activate selected controls
4. [ ] I-4 Screen reader labels exist for settings inputs (simulation speed, difficulty, failure rate)
5. [ ] I-5 Responsive check (≤ 768px width): control panel stacks as designed, no content cut off

Expected: Usable via keyboard; visible focus states; responsive without clipping.

---

## J. Performance & Stability
1. [ ] J-1 Run for 5+ minutes: memory usage stable (no progressive slowdowns)
2. [ ] J-2 Starting/stopping 5 times does not degrade performance
3. [ ] J-3 Console free of repeating warnings/errors

---

## K. Known Areas To Validate Closely (Common Issues)
1. [ ] K-1 OrbitControls availability (fallback vs CDN)
2. [ ] K-2 Camera focus per tab (some systems may not yet focus)
3. [ ] K-3 System buttons that don’t update status immediately
4. [ ] K-4 Charts not updating after first run
5. [ ] K-5 Settings sliders not affecting pacing/failure rates yet
6. [ ] K-6 Horizontal scrollbar visibility across browsers (Chrome/Edge/Firefox)

---

## L. Report Format (example)

Copy this section and list any failures you encounter with details:

```
Environment: Windows 11, Chrome 125

Failures:
- B-2 Side: Clicking Side does nothing (console: TypeError ...)
- E-3 Purification Stop: Status text doesn’t change to offline
- F-2 Simulation Speed: No visible change to update cadence

Observations:
- Horizontal scrollbar hidden until hovering; consider always-visible track
- 3D particles clip through geometry when zoomed out far
```

---

If you prefer, just give me the IDs (e.g., B-2, E-3 Stop, F-2) and I’ll dive straight into fixes.



