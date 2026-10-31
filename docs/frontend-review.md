# First customer slice review

## Direction

The split stage, seed 38801458; no redraws. Coastal blue, warm ivory and navy
are the user's selected brand colors. Bodoni Moda and Jost are the dealt typefaces.
Results use Framed sheet, seed 334434157, keeping the same palette and type.
The persistent Marchica view carries the homecoming idea beside the arrival planner.

## Visual review

ROUND 1
Seen in one second: A return to Nador beside the Marchica lagoon.
Idea (one sentence): The return-home journey becomes a persistent coastal view beside an arrival planner.
Live thing: Search dates and handover location, compare prices, inspect a quote.
Layout words by section: hero=split / process=itinerary / offers=catalogue / faq=reading / footer=close
Scores: design 7 · usability 7 · creativity 7 · content 8 → overall 7.1
Caps applied: none beyond the visible phone date-control defect.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Mobile fold: native date controls exceed half-column widths. Stack them on phones.
2. Mobile page: hiding the process heading's line break joins two words. Add a space.
3. Mobile page: footer actions end unevenly. Align the return action to the frame's right edge.

ROUND 2
Seen in one second: A clear Nador homecoming headline and an arrival search.
Idea (one sentence): Nador's coastal view stays present while the traveler plans the handover.
Live thing: Pickup matching, date estimates, budget/transmission filtering and vehicle details.
Layout words by section: hero=split / process=itinerary / offers=catalogue / faq=reading / footer=close
Scores: design 7.5 · usability 8 · creativity 7 · content 8 → overall 7.6
Caps applied: none. The regional idea is a tasteful known approach, not a novel interaction.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Desktop page: fleet photography has varied settings; replace with agency-supplied photos before launch.
2. Mobile fold: the coastal image follows the working search, so the image is only partly visible initially; retain search priority.
3. Tablet page: fleet columns are compact; they remain readable, but a future larger fleet should use the results list.

All homepage screenshots at 1440, 768 and 390 were opened after the responsive fix.
Homepage inspector: zero failures. Warnings are justified: ivory is the selected
brand ground; there are four actual photos (the inspector classifies three as
product interface content); a slow photo drift supplies atmosphere without a video download.
Real phone hardware was not available; viewport checks do not verify mobile Safari's native date picker.

## Photography

Only these downloaded photos are used. Credits and source/license links appear in
the interface footer. No generated imagery, bundled stock or drawn photo stand-ins.

- “Lagune Marchica”, Houssain tork, CC BY-SA 4.0:
  https://commons.wikimedia.org/wiki/File:Lagune_Marchica.jpg
- “Renault Clio V 1X7A0392”, Alexander Migl, CC BY-SA 4.0:
  https://commons.wikimedia.org/wiki/File:Renault_Clio_V_1X7A0392.jpg
- “Dacia Sandero III 1X7A6451”, Alexander Migl, CC BY-SA 4.0:
  https://commons.wikimedia.org/wiki/File:Dacia_Sandero_III_1X7A6451.jpg
- “Peugeot 208 PureTech 130 EAT8 Allure GT-Line (II) – f 17102021”, © M 93, CC BY-SA 3.0:
  https://commons.wikimedia.org/wiki/File:Peugeot_208_PureTech_130_EAT8_Allure_GT-Line_(II)_%E2%80%93_f_17102021.jpg

Photos illustrate the model rather than an actual rental vehicle. Their display is
cropped; original licenses are retained in the source metadata.

## Validation and limits

Production build passes. Four domain tests cover integer pricing, unsupported pickup,
transmission filtering, duration rounding and Casablanca civil-time conversion.
Browser click-through verifies search, automatic transmission filtering, empty budget
results, a vehicle's itemized estimate, dialog closing and port pickup matching.
Agencies, prices, deposits, delivery fees and rental conditions are fictional.
French only. No booking, accounts, payments, persistent data or live calendar yet.

Search-results inspector also finishes with zero failures at 1440, 768 and 390. All six result screenshots were opened. Its single palette warning is the selected ivory. Results critique: task and prices are clear; compact tablet action wraps to two lines; mobile jumps toward results on navigation through programmatic heading focus. No layout collisions were observed. Design 7, usability 7.5, creativity 7, content 8 (overall 7.3). Future refinement: collapse mobile search controls behind an edit-search disclosure, and replace reference photography with consistent agency inventory images.
