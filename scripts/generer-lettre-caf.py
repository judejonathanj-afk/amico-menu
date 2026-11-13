#!/usr/bin/env python3
"""Génère la lettre CAF au format PDF."""

from datetime import date
from pathlib import Path

from fpdf import FPDF


class LettreCAF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")


def main() -> None:
    today = date.today().strftime("%d/%m/%Y")
    output = Path.home() / "Downloads" / "Lettre_CAF_absence_memento_fiscal_Jude_Malingapot.pdf"

    pdf = LettreCAF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()
    pdf.set_margins(25, 25, 25)

    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(0, 0, 0)

    pdf.cell(0, 6, "Jude MALINGAPOT", ln=True)
    pdf.cell(0, 6, "[Votre adresse postale]", ln=True)
    pdf.cell(0, 6, "[Code postal] [Ville]", ln=True)
    pdf.cell(0, 6, "[Téléphone]", ln=True)
    pdf.cell(0, 6, "[Numéro allocataire CAF]", ln=True)
    pdf.ln(8)

    pdf.set_font("Helvetica", "B", 11)
    pdf.multi_cell(
        0,
        6,
        "Objet : Absence de memento fiscal - Société créée en 2018 sans activité",
    )
    pdf.ln(4)
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 6, f"Fait à [Ville], le {today}", ln=True)
    pdf.ln(8)

    pdf.multi_cell(
        0,
        6,
        "Madame, Monsieur,\n"
        "Responsable de la Caisse d'Allocations Familiales,\n"
        "Service des droits",
    )
    pdf.ln(8)

    body = (
        "Suite à votre demande de pièce justificative concernant le "
        "« memento fiscal obtenu auprès du service des impôts des entreprises "
        "ou depuis votre compte professionnel des impôts pour Jude MALINGAPOT », "
        "je vous prie de bien vouloir trouver ci-dessous les explications "
        "relatives à ma situation.\n\n"
        "En 2018, j'ai effectué des démarches d'ouverture d'une société.\n\n"
        "Toutefois, après cette création, aucune activité commerciale ou "
        "professionnelle n'a jamais été exercée au titre de cette société. "
        "Plus précisément :\n\n"
        "  - aucun chiffre d'affaires n'a été réalisé ;\n"
        "  - aucune facturation ni encaissement n'a été effectué ;\n"
        "  - aucune déclaration fiscale ou comptable n'a été produite ;\n"
        "  - je ne dispose pas de compte professionnel sur impots.gouv.fr ;\n"
        "  - aucun memento fiscal n'a donc jamais été établi ou transmis "
        "par l'administration fiscale.\n\n"
        "Depuis 2018, je suis salarié et mes revenus proviennent exclusivement "
        "de mon activité salariée. Je peux, sur demande, transmettre mes "
        "justificatifs de revenus salariés (contrat de travail, bulletins "
        "de salaire, attestation employeur).\n\n"
        "Je souhaite par ailleurs informer votre service que je suis "
        "actuellement en démarches pour procéder à la fermeture définitive "
        "de cette société auprès du greffe du tribunal de commerce et "
        "de l'administration fiscale compétente.\n\n"
        "En conséquence, je ne suis pas en mesure de joindre le memento fiscal "
        "demandé, ce document n'existant pas compte tenu de l'absence totale "
        "d'activité de la société.\n\n"
        "Je vous remercie de bien vouloir prendre en compte ces éléments "
        "et reste à votre disposition pour tout complément d'information "
        "ou toute pièce complémentaire utile au traitement de mon dossier."
    )

    pdf.multi_cell(0, 6, body)
    pdf.ln(10)

    pdf.cell(0, 6, "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.", ln=True)
    pdf.ln(12)
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 6, "Jude MALINGAPOT", ln=True)
    pdf.ln(8)

    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(
        0,
        5,
        "Pièces complémentaires recommandées (à joindre séparément si disponibles) : "
        "extrait K-bis ou attestation INPI, attestation sur l'honneur, "
        "contrat de travail et bulletins de salaire récents.",
    )

    output.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(output))
    print(output)


if __name__ == "__main__":
    main()
