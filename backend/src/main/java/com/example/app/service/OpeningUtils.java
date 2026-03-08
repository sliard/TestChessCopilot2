package com.example.app.service;

import com.example.app.entity.Opening;

import java.util.Arrays;

/**
 * Shared utility methods for Opening services.
 */
public final class OpeningUtils {

    private OpeningUtils() {
        // Utility class
    }

    /**
     * Returns the display name of the opening's author.
     */
    public static String getAuthorName(Opening opening) {
        if (opening.getUser() == null) {
            return "Système";
        }
        return opening.getUser().getFirstName() + " " + opening.getUser().getLastName();
    }

    /**
     * Counts the number of actual moves (excluding move numbers like "1.", "2.") in a moves string.
     */
    public static int countMoves(String moves) {
        if (moves == null || moves.isBlank()) return 0;
        return (int) Arrays.stream(moves.trim().split("\\s+"))
                .filter(token -> !token.matches("\\d+\\.+"))
                .count();
    }

    /**
     * Returns null if the string is null or blank, otherwise returns the trimmed string.
     */
    public static String nullIfBlank(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }

    /**
     * Escapes SQL LIKE wildcard characters (% and _) in user input.
     */
    public static String escapeLikeWildcards(String input) {
        if (input == null) return null;
        return input.replace("\\", "\\\\")
                     .replace("%", "\\%")
                     .replace("_", "\\_");
    }
}
