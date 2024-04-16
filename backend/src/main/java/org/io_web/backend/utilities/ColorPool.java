package org.io_web.backend.utilities;

import java.awt.*;

public class ColorPool {
    private static final double PHI = 0.618033988749895;
    private static int i = 0;

    public static String generateColor() {
        float hue = (float) (256 * (i * PHI - Math.floor(i * PHI)));
        float saturation = Math.min((float) Math.random() + 0.6f, 1.0f);

        int rgb = Color.HSBtoRGB(hue, saturation, 0.95f);
        ++i;
        Color color = new Color(rgb);

        return String.format("rgb(%d, %d, %d)", color.getRed(), color.getGreen(), color.getBlue());
    }
}
