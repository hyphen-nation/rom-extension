### Basic instruction data
You can execute **anything** in JavaScript ROM.
You have a built in 480x360 frame buffer, with all 16777216 colours.

Put a minified JS file in the Load ROM block, and call frames off it.

From the ROM output, a delta block will be returned showing changes.

A frame must return the full frame buffer delta. There is also 256 levels of depth.

All format: RGBD ( No alpha, D: Depth )

This determines the layering, Maybe 3D data will be possible.

### For the ROM data .js
The Load ROM block has a input for minified JS files.

A rom can only be loaded once until **"Clear ROM"** is executed.

Once cleared, frame count is reset.

frame_tick() always has a frame / tick counter passed to it ( Number )

### Rom structure
ROM .js file must be like this:
```JavaScript
let resx = window.gpu_rom.resx
let resy = window.gpu_rom.resy
function frame_tick(frame_count) {
    let frame = new Uint32Array(resx * resy)
    for (let i = 0; i < frame.length; i++) {
        frame[i] = (i + frame_count) % 65536
    }
    return frame
}
window.frame_tick = frame_tick
```
