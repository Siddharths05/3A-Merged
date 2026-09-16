from datetime import datetime
from io import BytesIO

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.responses import StreamingResponse

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from docx import Document

from sqlalchemy.orm import Session

from database import get_db

from model import (
    ability_exists,
    ability_exists_for_other,
    ability_to_dict,
    advertising_media_exists,
    advertising_media_exists_for_other,
    advertising_media_to_dict,
    advertising_purpose_exists,
    advertising_purpose_exists_for_other,
    advertising_purpose_to_dict,
    announcement_type_exists,
    announcement_type_exists_for_other,
    announcement_type_to_dict,
    create_ability,
    create_advertising_media,
    create_advertising_purpose,
    create_announcement_type,
    create_hobby,
    create_ksa,
    create_ksa_category,
    create_position_grade,
    create_role_in_offense,
    create_language,
    create_location,
    create_meeting_location,
    create_meeting_type,
    create_office_level,
    create_office_type,
    create_requirement,
    create_user,
    delete_ability as hard_delete_ability,
    delete_advertising_media as hard_delete_advertising_media,
    delete_advertising_purpose as hard_delete_advertising_purpose,
    delete_announcement_type as hard_delete_announcement_type,
    delete_hobby as hard_delete_hobby,
    delete_ksa as hard_delete_ksa,
    delete_ksa_category as hard_delete_ksa_category,
    delete_position_grade as hard_delete_position_grade,
    delete_role_in_offense as hard_delete_role_in_offense,
    delete_language as hard_delete_language,
    delete_location as hard_delete_location,
    delete_meeting_location as hard_delete_meeting_location,
    delete_meeting_type as hard_delete_meeting_type,
    delete_office_level as hard_delete_office_level,
    delete_office_type as hard_delete_office_type,
    delete_requirement as hard_delete_requirement,
    get_abilities,
    get_ability_by_id,
    get_active_user_count,
    get_active_users,
    get_advertising_media_by_id,
    get_advertising_medias,
    get_advertising_purpose_by_id,
    get_advertising_purposes,
    get_announcement_type_by_id,
    get_announcement_types,
    get_hobbies,
    get_hobby_by_id,
    get_ksa_by_id,
    get_ksa_categories,
    get_ksa_category_by_id,
    get_position_grade_by_id,
    get_position_grades,
    get_role_in_offense_by_id,
    get_role_in_offenses,
    get_ksas,
    get_language_by_id,
    get_languages,
    get_location_by_id,
    get_locations,
    get_meeting_location_by_id,
    get_meeting_locations,
    get_meeting_type_by_id,
    get_meeting_types,
    get_office_level_by_id,
    get_office_levels,
    get_office_type_by_id,
    get_office_types,
    get_requirement_by_id,
    get_requirements,
    get_user_by_email,
    get_user_by_full_name,
    get_user_by_id,
    get_user_rights_map,
    hobby_exists,
    hobby_exists_for_other,
    hobby_to_dict,
    ksa_category_exists,
    ksa_category_exists_for_other,
    ksa_category_to_dict,
    position_grade_exists,
    position_grade_exists_for_other,
    position_grade_to_dict,
    role_in_offense_exists,
    role_in_offense_exists_for_other,
    role_in_offense_to_dict,
    ksa_exists,
    ksa_exists_for_other,
    ksa_to_dict,
    language_exists,
    language_exists_for_other,
    language_to_dict,
    location_exists,
    location_exists_for_other,
    location_to_dict,
    meeting_location_exists,
    meeting_location_exists_for_other,
    meeting_location_to_dict,
    meeting_type_exists,
    meeting_type_exists_for_other,
    meeting_type_to_dict,
    office_level_exists,
    office_level_exists_for_other,
    office_level_to_dict,
    office_type_exists,
    office_type_exists_for_other,
    office_type_to_dict,
    requirement_exists,
    requirement_exists_for_other,
    requirement_to_dict,
    set_user_rights_bulk,
    soft_delete_user,
    update_ability,
    update_advertising_media,
    update_advertising_purpose,
    update_announcement_type,
    update_hobby,
    update_ksa,
    update_ksa_category,
    update_position_grade,
    update_role_in_offense,
    update_language,
    update_location,
    update_meeting_location,
    update_meeting_type,
    update_office_level,
    update_office_type,
    update_requirement,
    update_user,
    user_right_to_dict,
)

from schema import (
    AbilityCreateRequest,
    AbilityUpdateRequest,
    AdvertisingMediaCreateRequest,
    AdvertisingMediaUpdateRequest,
    AdvertisingPurposeCreateRequest,
    AdvertisingPurposeUpdateRequest,
    AnnouncementTypeCreateRequest,
    AnnouncementTypeUpdateRequest,
    CreateUserRequest,
    HobbyCreateRequest,
    HobbyUpdateRequest,
    KSACategoryCreateRequest,
    KSACategoryUpdateRequest,
    PositionGradeCreateRequest,
    PositionGradeUpdateRequest,
    RoleInOffenseCreateRequest,
    RoleInOffenseUpdateRequest,
    KSACreateRequest,
    KSAUpdateRequest,
    LanguageCreateRequest,
    LanguageUpdateRequest,
    LocationCreateRequest,
    LocationUpdateRequest,
    LoginRequest,
    MeetingLocationCreateRequest,
    MeetingLocationUpdateRequest,
    MeetingTypeCreateRequest,
    MeetingTypeUpdateRequest,
    OfficeLevelCreateRequest,
    OfficeLevelUpdateRequest,
    OfficeTypeCreateRequest,
    OfficeTypeUpdateRequest,
    RegisterRequest,
    RequirementCreateRequest,
    RequirementUpdateRequest,
    SetUserRightsRequest,
    UpdateUserRequest,
    UpdateUserStatusRequest,
)

from security import (
    create_access_token,
    get_current_user,
    hash_password,
    require_admin,
    require_permission,
    validate_password,
    verify_password,
)


# ==================================================
# ROUTER
# ==================================================

router = APIRouter()


# ==================================================
# EXPORT / PRINT HELPERS (Phase 3)
# ==================================================

def _export_to_excel(records, columns, sheet_title="Data"):
    """
    records: list of model objects
    columns: list of (header_display, attr_name)
    """
    wb = Workbook()
    ws = wb.active
    ws.title = sheet_title[:31]

    header_fill = PatternFill(
        start_color="366092",
        end_color="366092",
        fill_type="solid",
    )
    header_font = Font(bold=True, color="FFFFFF")
    header_align = Alignment(horizontal="center")

    for col_idx, (header, _) in enumerate(columns, 1):
        cell = ws.cell(row=1, column=col_idx, value=header)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_align

    for row_idx, record in enumerate(records, 2):
        for col_idx, (_, attr) in enumerate(columns, 1):
            value = getattr(record, attr, None)
            ws.cell(row=row_idx, column=col_idx, value=value)

    for col in ws.columns:
        max_len = 0
        letter = col[0].column_letter
        for cell in col:
            max_len = max(max_len, len(str(cell.value or "")))
        ws.column_dimensions[letter].width = min(max_len + 2, 50)

    stream = BytesIO()
    wb.save(stream)
    stream.seek(0)
    return stream


def _export_to_word(records, columns, title):
    """
    records: list of model objects
    columns: list of (header_display, attr_name)
    """
    doc = Document()
    doc.add_heading(title, level=1)
    doc.add_paragraph(
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )

    table = doc.add_table(rows=1, cols=len(columns))
    table.style = "Light Grid Accent 1"

    header_cells = table.rows[0].cells
    for idx, (header, _) in enumerate(columns):
        header_cells[idx].text = header
        for paragraph in header_cells[idx].paragraphs:
            for run in paragraph.runs:
                run.font.bold = True

    for record in records:
        row_cells = table.add_row().cells
        for col_idx, (_, attr) in enumerate(columns):
            value = getattr(record, attr, None)
            row_cells[col_idx].text = "" if value is None else str(value)

    stream = BytesIO()
    doc.save(stream)
    stream.seek(0)
    return stream


def _file_date():
    return datetime.now().strftime("%Y_%m_%d")




# ==================================================
# EXPORT / PRINT ENDPOINTS (Phase 3)
# ==================================================


@router.get("/abilities/export")
def export_abilities(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("ability", "export")
    ),
):
    records = get_abilities(db)
    columns = [("ID", "pkABId"), ("Abilities", "Abilities")]
    stream = _export_to_excel(records, columns, sheet_title="Ability")
    filename = f"export_Ability_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/abilities/print")
def print_abilities(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("ability", "print")
    ),
):
    records = get_abilities(db)
    columns = [("ID", "pkABId"), ("Abilities", "Abilities")]
    stream = _export_to_word(
        records, columns, title="Ability Report"
    )
    filename = f"print_Ability_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/locations/export")
def export_locations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("location", "export")
    ),
):
    records = get_locations(db)
    columns = [("ID", "pkHLId"), ("Location", "Location")]
    stream = _export_to_excel(records, columns, sheet_title="Location")
    filename = f"export_Location_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/locations/print")
def print_locations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("location", "print")
    ),
):
    records = get_locations(db)
    columns = [("ID", "pkHLId"), ("Location", "Location")]
    stream = _export_to_word(
        records, columns, title="Location Report"
    )
    filename = f"print_Location_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/hobbies/export")
def export_hobbies(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("hobby", "export")
    ),
):
    records = get_hobbies(db)
    columns = [("ID", "pkHId"), ("Hobby", "Hobby")]
    stream = _export_to_excel(records, columns, sheet_title="Hobby")
    filename = f"export_Hobby_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/hobbies/print")
def print_hobbies(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("hobby", "print")
    ),
):
    records = get_hobbies(db)
    columns = [("ID", "pkHId"), ("Hobby", "Hobby")]
    stream = _export_to_word(
        records, columns, title="Hobby Report"
    )
    filename = f"print_Hobby_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/announcement-types/export")
def export_announcement_types(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("announcement_type", "export")
    ),
):
    records = get_announcement_types(db)
    columns = [("ID", "pkATId"), ("Announcement Type", "AnnouncementType")]
    stream = _export_to_excel(records, columns, sheet_title="AnnouncementType")
    filename = f"export_AnnouncementType_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/announcement-types/print")
def print_announcement_types(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("announcement_type", "print")
    ),
):
    records = get_announcement_types(db)
    columns = [("ID", "pkATId"), ("Announcement Type", "AnnouncementType")]
    stream = _export_to_word(
        records, columns, title="AnnouncementType Report"
    )
    filename = f"print_AnnouncementType_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/office-levels/export")
def export_office_levels(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("office_level", "export")
    ),
):
    records = get_office_levels(db)
    columns = [("ID", "pkOLId"), ("Office Level", "OfficeLevel")]
    stream = _export_to_excel(records, columns, sheet_title="OfficeLevel")
    filename = f"export_OfficeLevel_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/office-levels/print")
def print_office_levels(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("office_level", "print")
    ),
):
    records = get_office_levels(db)
    columns = [("ID", "pkOLId"), ("Office Level", "OfficeLevel")]
    stream = _export_to_word(
        records, columns, title="OfficeLevel Report"
    )
    filename = f"print_OfficeLevel_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/meeting-types/export")
def export_meeting_types(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("meeting_type", "export")
    ),
):
    records = get_meeting_types(db)
    columns = [("ID", "pkMTId"), ("Meeting Type", "MeetingType")]
    stream = _export_to_excel(records, columns, sheet_title="MeetingType")
    filename = f"export_MeetingType_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/meeting-types/print")
def print_meeting_types(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("meeting_type", "print")
    ),
):
    records = get_meeting_types(db)
    columns = [("ID", "pkMTId"), ("Meeting Type", "MeetingType")]
    stream = _export_to_word(
        records, columns, title="MeetingType Report"
    )
    filename = f"print_MeetingType_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/languages/export")
def export_languages(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("language", "export")
    ),
):
    records = get_languages(db)
    columns = [("ID", "pkLId"), ("Language", "Language")]
    stream = _export_to_excel(records, columns, sheet_title="Language")
    filename = f"export_Language_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/languages/print")
def print_languages(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("language", "print")
    ),
):
    records = get_languages(db)
    columns = [("ID", "pkLId"), ("Language", "Language")]
    stream = _export_to_word(
        records, columns, title="Language Report"
    )
    filename = f"print_Language_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/requirements/export")
def export_requirements(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("requirement", "export")
    ),
):
    records = get_requirements(db)
    columns = [("ID", "pkRId"), ("Requirement", "Requirement")]
    stream = _export_to_excel(records, columns, sheet_title="Requirement")
    filename = f"export_Requirement_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/requirements/print")
def print_requirements(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("requirement", "print")
    ),
):
    records = get_requirements(db)
    columns = [("ID", "pkRId"), ("Requirement", "Requirement")]
    stream = _export_to_word(
        records, columns, title="Requirement Report"
    )
    filename = f"print_Requirement_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/advertising-medias/export")
def export_advertising_medias(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("advertising_media", "export")
    ),
):
    records = get_advertising_medias(db)
    columns = [("ID", "pkAMId"), ("Advertising Media", "AdvertisingMedia")]
    stream = _export_to_excel(records, columns, sheet_title="AdvertisingMedia")
    filename = f"export_AdvertisingMedia_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/advertising-medias/print")
def print_advertising_medias(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("advertising_media", "print")
    ),
):
    records = get_advertising_medias(db)
    columns = [("ID", "pkAMId"), ("Advertising Media", "AdvertisingMedia")]
    stream = _export_to_word(
        records, columns, title="AdvertisingMedia Report"
    )
    filename = f"print_AdvertisingMedia_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/advertising-purposes/export")
def export_advertising_purposes(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("advertising_purpose", "export")
    ),
):
    records = get_advertising_purposes(db)
    columns = [("ID", "pkAPId"), ("Advertising Purpose", "AdvertisingPurpose")]
    stream = _export_to_excel(records, columns, sheet_title="AdvertisingPurpose")
    filename = f"export_AdvertisingPurpose_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/advertising-purposes/print")
def print_advertising_purposes(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("advertising_purpose", "print")
    ),
):
    records = get_advertising_purposes(db)
    columns = [("ID", "pkAPId"), ("Advertising Purpose", "AdvertisingPurpose")]
    stream = _export_to_word(
        records, columns, title="AdvertisingPurpose Report"
    )
    filename = f"print_AdvertisingPurpose_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/office-types/export")
def export_office_types(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("office_type", "export")
    ),
):
    records = get_office_types(db)
    columns = [("ID", "pkOTId"), ("Office Type", "OfficeType")]
    stream = _export_to_excel(records, columns, sheet_title="OfficeType")
    filename = f"export_OfficeType_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/office-types/print")
def print_office_types(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("office_type", "print")
    ),
):
    records = get_office_types(db)
    columns = [("ID", "pkOTId"), ("Office Type", "OfficeType")]
    stream = _export_to_word(
        records, columns, title="OfficeType Report"
    )
    filename = f"print_OfficeType_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/meeting-locations/export")
def export_meeting_locations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("meeting_location", "export")
    ),
):
    records = get_meeting_locations(db)
    columns = [("ID", "pkMLId"), ("Meeting Location", "MeetingLocation")]
    stream = _export_to_excel(records, columns, sheet_title="MeetingLocation")
    filename = f"export_MeetingLocation_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/meeting-locations/print")
def print_meeting_locations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("meeting_location", "print")
    ),
):
    records = get_meeting_locations(db)
    columns = [("ID", "pkMLId"), ("Meeting Location", "MeetingLocation")]
    stream = _export_to_word(
        records, columns, title="MeetingLocation Report"
    )
    filename = f"print_MeetingLocation_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/ksas/export")
def export_ksas(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("ksa", "export")
    ),
):
    records = get_ksas(db)
    columns = [("ID", "pkKSAId"), ("KSA", "KSA")]
    stream = _export_to_excel(records, columns, sheet_title="KSA")
    filename = f"export_KSA_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/ksas/print")
def print_ksas(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("ksa", "print")
    ),
):
    records = get_ksas(db)
    columns = [("ID", "pkKSAId"), ("KSA", "KSA")]
    stream = _export_to_word(
        records, columns, title="KSA Report"
    )
    filename = f"print_KSA_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/ksa-categories/export")
def export_ksa_categories(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("ksa_category", "export")
    ),
):
    records = get_ksa_categories(db)
    columns = [("ID", "pkKSACId"), ("KSA Category", "KSACategory")]
    stream = _export_to_excel(records, columns, sheet_title="KSACategory")
    filename = f"export_KSACategory_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/ksa-categories/print")
def print_ksa_categories(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("ksa_category", "print")
    ),
):
    records = get_ksa_categories(db)
    columns = [("ID", "pkKSACId"), ("KSA Category", "KSACategory")]
    stream = _export_to_word(
        records, columns, title="KSACategory Report"
    )
    filename = f"print_KSACategory_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/position-grades/export")
def export_position_grades(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("position_grade", "export")
    ),
):
    records = get_position_grades(db)
    columns = [("ID", "pkPGId"), ("Position Grade", "PositionGrade"), ("Minimum Pay", "MinimumPay"), ("Maximum Pay", "MaximumPay")]
    stream = _export_to_excel(records, columns, sheet_title="PositionGrade")
    filename = f"export_PositionGrade_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/position-grades/print")
def print_position_grades(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("position_grade", "print")
    ),
):
    records = get_position_grades(db)
    columns = [("ID", "pkPGId"), ("Position Grade", "PositionGrade"), ("Minimum Pay", "MinimumPay"), ("Maximum Pay", "MaximumPay")]
    stream = _export_to_word(
        records, columns, title="PositionGrade Report"
    )
    filename = f"print_PositionGrade_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/role-in-offenses/export")
def export_role_in_offenses(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("role_in_offense", "export")
    ),
):
    records = get_role_in_offenses(db)
    columns = [("ID", "pkRIOId"), ("Role in Offense", "RoleInOffense"), ("Minimum Penalty", "MinimumPenalty"), ("Maximum Penalty", "MaximumPenalty")]
    stream = _export_to_excel(records, columns, sheet_title="RoleInOffense")
    filename = f"export_RoleInOffense_{_file_date()}.xlsx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/role-in-offenses/print")
def print_role_in_offenses(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_permission("role_in_offense", "print")
    ),
):
    records = get_role_in_offenses(db)
    columns = [("ID", "pkRIOId"), ("Role in Offense", "RoleInOffense"), ("Minimum Penalty", "MinimumPenalty"), ("Maximum Penalty", "MaximumPenalty")]
    stream = _export_to_word(
        records, columns, title="RoleInOffense Report"
    )
    filename = f"print_RoleInOffense_{_file_date()}.docx"
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )

# ==================================================
# REGISTER
# ==================================================

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
def register(

    request: RegisterRequest,

    db: Session = Depends(get_db),
):

    # ==============================================
    # NORMALIZE EMAIL / FULL NAME
    # ==============================================

    email = request.email.strip().lower()

    full_name = request.full_name.strip()


    # ==============================================
    # CHECK EMAIL
    # ==============================================

    existing_email_user = get_user_by_email(
        db,
        email,
    )

    if existing_email_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )


    # ==============================================
    # CHECK FULL NAME
    # (login is by full name, so it must be unique)
    # ==============================================

    existing_full_name_user = get_user_by_full_name(
        db,
        full_name,
    )

    if existing_full_name_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this full name already exists",
        )


    # ==============================================
    # VALIDATE PASSWORD
    # ==============================================

    validate_password(
        request.password
    )


    # ==============================================
    # HASH PASSWORD
    # ==============================================

    password_hash = hash_password(
        request.password
    )


    # ==============================================
    # CREATE USER
    # ==============================================

    user = create_user(

        db=db,

        email=email,

        password_hash=password_hash,

        full_name=full_name,

        role="user",
    )


    # ==============================================
    # RESPONSE
    # ==============================================

    return {

        "message": "User registered successfully",

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,
        },
    }


# ==================================================
# LOGIN
# ==================================================

@router.post(
    "/login",
)
def login(

    request: LoginRequest,

    db: Session = Depends(get_db),
):

    # ==============================================
    # NORMALIZE FULL NAME
    # ==============================================

    full_name = request.full_name.strip()


    # ==============================================
    # GET USER
    # ==============================================

    user = get_user_by_full_name(
        db,
        full_name,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid full name or password",
        )


    # ==============================================
    # DELETED USER CHECK
    # ==============================================

    if user.deleted_at is not None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid full name or password",
        )


    # ==============================================
    # ACTIVE USER CHECK
    # ==============================================

    if not user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated",
        )


    # ==============================================
    # VERIFY PASSWORD
    # ==============================================

    password_valid = verify_password(

        request.password,

        user.password_hash,
    )

    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid full name or password",
        )


    # ==============================================
    # CREATE TOKEN
    # ==============================================

    access_token = create_access_token(
        user.pkid
    )


    # ==============================================
    # RESPONSE
    # ==============================================

    return {

        "message": "Login successful",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,
        },
    }


# ==================================================
# GET CURRENT USER
# ==================================================

@router.get(
    "/me",
)
def get_me(

    current_user: dict = Depends(
        get_current_user
    ),
):

    return {

        "user": current_user,
    }


# ==================================================
# GET ALL USERS
# ADMIN ONLY
# ==================================================

@router.get(
    "/users",
)
def get_users(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    users = get_active_users(
        db
    )

    return {

        "total": len(users),

        "users": [

            {

                "pkid": user.pkid,

                "email": user.email,

                "full_name": user.full_name,

                "role": user.role,

                "is_active": user.is_active,

                "updated_at": user.updated_at,
            }

            for user in users
        ],
    }


# ==================================================
# GET USER COUNT
# ADMIN ONLY
# MUST BE REGISTERED BEFORE /users/{user_id}
# OR "count" WILL BE PARSED AS user_id
# AND FAIL INT VALIDATION (422)
# ==================================================

@router.get(
    "/users/count",
)
def get_user_count(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    count = get_active_user_count(
        db
    )

    return {

        "count": count,
    }


# ==================================================
# GET USER BY ID
# ADMIN ONLY
# ==================================================

@router.get(
    "/users/{user_id}",
)
def get_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,

            "updated_at": user.updated_at,
        },
    }


# ==================================================
# CREATE USER
# ADMIN ONLY
# ==================================================

@router.post(
    "/users",
    status_code=status.HTTP_201_CREATED,
)
def create_new_user(

    request: CreateUserRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    # ==============================================
    # NORMALIZE EMAIL / FULL NAME
    # ==============================================

    email = request.email.strip().lower()

    full_name = request.full_name.strip()


    # ==============================================
    # CHECK EMAIL
    # ==============================================

    existing_email_user = get_user_by_email(
        db,
        email,
    )

    if existing_email_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )


    # ==============================================
    # CHECK FULL NAME
    # (login is by full name, so it must be unique)
    # ==============================================

    existing_full_name_user = get_user_by_full_name(
        db,
        full_name,
    )

    if existing_full_name_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this full name already exists",
        )


    # ==============================================
    # VALIDATE PASSWORD
    # ==============================================

    validate_password(
        request.password
    )


    # ==============================================
    # HASH PASSWORD
    # ==============================================

    password_hash = hash_password(
        request.password
    )


    # ==============================================
    # CREATE USER
    # ==============================================

    user = create_user(

        db=db,

        email=email,

        password_hash=password_hash,

        full_name=full_name,

        role=request.role.strip().lower(),
    )


    return {

        "message": "User created successfully",

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,

            "updated_at": user.updated_at,
        },
    }


# ==================================================
# UPDATE USER
# ADMIN ONLY
# ==================================================

@router.put(
    "/users/{user_id}",
)
def update_existing_user(

    user_id: int,

    request: UpdateUserRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    # ==============================================
    # GET USER
    # ==============================================

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


    # ==============================================
    # UPDATE DATA
    # ==============================================

    update_data = {}


    # ==============================================
    # FULL NAME
    # (login is by full name, so it must stay unique)
    # ==============================================

    if request.full_name is not None:

        full_name = request.full_name.strip()

        existing_full_name_user = get_user_by_full_name(
            db,
            full_name,
        )

        if (

            existing_full_name_user

            and existing_full_name_user.pkid != user.pkid

        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this full name already exists",
            )

        update_data["full_name"] = full_name


    # ==============================================
    # EMAIL
    # ==============================================

    if request.email is not None:

        email = request.email.strip().lower()

        existing_user = get_user_by_email(
            db,
            email,
        )

        if (

            existing_user

            and existing_user.pkid != user.pkid

        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        update_data["email"] = email


    # ==============================================
    # ROLE
    # ==============================================

    if request.role is not None:

        update_data["role"] = (
            request.role.strip().lower()
        )


    # ==============================================
    # PASSWORD
    # ==============================================

    if request.password is not None:

        validate_password(
            request.password
        )

        update_data["password_hash"] = (
            hash_password(
                request.password
            )
        )


    # ==============================================
    # UPDATE USER
    # ==============================================

    user = update_user(

        db,

        user,

        **update_data,
    )


    return {

        "message": "User updated successfully",

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,

            "updated_at": user.updated_at,
        },
    }


# ==================================================
# ACTIVATE / DEACTIVATE USER
# ADMIN ONLY
# ==================================================

@router.patch(
    "/users/{user_id}/status",
)
def update_user_status(

    user_id: int,

    request: UpdateUserStatusRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


    # ==============================================
    # UPDATE STATUS
    # ==============================================

    user.is_active = request.is_active

    user = update_user(
        db,
        user,
    )


    return {

        "message": (
            "User activated successfully"
            if request.is_active
            else "User deactivated successfully"
        ),

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,
        },
    }


# ==================================================
# SOFT DELETE USER
# ADMIN ONLY
# ==================================================

@router.delete(
    "/users/{user_id}",
)
def delete_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


    # ==============================================
    # PREVENT ADMIN FROM DELETING SELF
    # ==============================================

    if user.pkid == current_user["pkid"]:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own account",
        )


    # ==============================================
    # SOFT DELETE
    # ==============================================

    soft_delete_user(
        db,
        user,
    )


    return {

        "message": "User deleted successfully",
    }


# ==================================================
# GET ABILITIES
# ==================================================

@router.get(
    "/abilities",
)
def list_abilities(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    abilities = get_abilities(
        db
    )

    return {

        "total": len(abilities),

        "abilities": [

            ability_to_dict(ability)

            for ability in abilities
        ],
    }


# ==================================================
# GET ABILITY BY ID
# ==================================================

@router.get(
    "/abilities/{ability_id}",
)
def get_ability(

    ability_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    ability = get_ability_by_id(
        db,
        ability_id,
    )

    if not ability:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ability not found",
        )

    return {

        "ability": ability_to_dict(ability),
    }


# ==================================================
# CREATE ABILITY
# REQUIRES: ability / add
# ==================================================

@router.post(
    "/abilities",
    status_code=status.HTTP_201_CREATED,
)
def create_new_ability(

    request: AbilityCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ability", "add")
    ),
):

    if ability_exists(
        db,
        request.abilities,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ability already exists",
        )

    ability = create_ability(
        db,
        request.abilities,
    )

    return {

        "message": "Ability created successfully",

        "ability": ability_to_dict(ability),
    }


# ==================================================
# UPDATE ABILITY
# REQUIRES: ability / edit
# ==================================================

@router.put(
    "/abilities/{ability_id}",
)
def update_existing_ability(

    ability_id: int,

    request: AbilityUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ability", "edit")
    ),
):

    existing = get_ability_by_id(
        db,
        ability_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ability not found",
        )

    if ability_exists_for_other(
        db,
        request.abilities,
        ability_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ability already exists",
        )

    ability = update_ability(
        db,
        ability_id,
        request.abilities,
    )

    return {

        "message": "Ability updated successfully",

        "ability": ability_to_dict(ability),
    }


# ==================================================
# DELETE ABILITY
# REQUIRES: ability / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/abilities/{ability_id}",
)
def delete_ability(

    ability_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ability", "delete")
    ),
):

    existing = get_ability_by_id(
        db,
        ability_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ability not found",
        )

    hard_delete_ability(
        db,
        ability_id,
    )

    return {

        "message": "Ability deleted successfully",
    }


# ==================================================
# GET LOCATIONS
# ==================================================

@router.get(
    "/locations",
)
def list_locations(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    locations = get_locations(
        db
    )

    return {

        "total": len(locations),

        "locations": [

            location_to_dict(location)

            for location in locations
        ],
    }


# ==================================================
# GET LOCATION BY ID
# ==================================================

@router.get(
    "/locations/{location_id}",
)
def get_location(

    location_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    location = get_location_by_id(
        db,
        location_id,
    )

    if not location:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )

    return {

        "location": location_to_dict(location),
    }


# ==================================================
# CREATE LOCATION
# REQUIRES: location / add
# ==================================================

@router.post(
    "/locations",
    status_code=status.HTTP_201_CREATED,
)
def create_new_location(

    request: LocationCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("location", "add")
    ),
):

    if location_exists(
        db,
        request.location,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location already exists",
        )

    location = create_location(
        db,
        request.location,
    )

    return {

        "message": "Location created successfully",

        "location": location_to_dict(location),
    }


# ==================================================
# UPDATE LOCATION
# REQUIRES: location / edit
# ==================================================

@router.put(
    "/locations/{location_id}",
)
def update_existing_location(

    location_id: int,

    request: LocationUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("location", "edit")
    ),
):

    existing = get_location_by_id(
        db,
        location_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )

    if location_exists_for_other(
        db,
        request.location,
        location_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location already exists",
        )

    location = update_location(
        db,
        location_id,
        request.location,
    )

    return {

        "message": "Location updated successfully",

        "location": location_to_dict(location),
    }


# ==================================================
# DELETE LOCATION
# REQUIRES: location / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/locations/{location_id}",
)
def delete_location(

    location_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("location", "delete")
    ),
):

    existing = get_location_by_id(
        db,
        location_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )

    hard_delete_location(
        db,
        location_id,
    )

    return {

        "message": "Location deleted successfully",
    }


# ==================================================
# GET HOBBIES
# ==================================================

@router.get(
    "/hobbies",
)
def list_hobbies(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    hobbies = get_hobbies(
        db
    )

    return {

        "total": len(hobbies),

        "hobbies": [

            hobby_to_dict(hobby)

            for hobby in hobbies
        ],
    }


# ==================================================
# GET HOBBY BY ID
# ==================================================

@router.get(
    "/hobbies/{hobby_id}",
)
def get_hobby(

    hobby_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    hobby = get_hobby_by_id(
        db,
        hobby_id,
    )

    if not hobby:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hobby not found",
        )

    return {

        "hobby": hobby_to_dict(hobby),
    }


# ==================================================
# CREATE HOBBY
# REQUIRES: hobby / add
# ==================================================

@router.post(
    "/hobbies",
    status_code=status.HTTP_201_CREATED,
)
def create_new_hobby(

    request: HobbyCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("hobby", "add")
    ),
):

    if hobby_exists(
        db,
        request.hobby,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hobby already exists",
        )

    hobby = create_hobby(
        db,
        request.hobby,
    )

    return {

        "message": "Hobby created successfully",

        "hobby": hobby_to_dict(hobby),
    }


# ==================================================
# UPDATE HOBBY
# REQUIRES: hobby / edit
# ==================================================

@router.put(
    "/hobbies/{hobby_id}",
)
def update_existing_hobby(

    hobby_id: int,

    request: HobbyUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("hobby", "edit")
    ),
):

    existing = get_hobby_by_id(
        db,
        hobby_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hobby not found",
        )

    if hobby_exists_for_other(
        db,
        request.hobby,
        hobby_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hobby already exists",
        )

    hobby = update_hobby(
        db,
        hobby_id,
        request.hobby,
    )

    return {

        "message": "Hobby updated successfully",

        "hobby": hobby_to_dict(hobby),
    }


# ==================================================
# DELETE HOBBY
# REQUIRES: hobby / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/hobbies/{hobby_id}",
)
def delete_hobby(

    hobby_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("hobby", "delete")
    ),
):

    existing = get_hobby_by_id(
        db,
        hobby_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hobby not found",
        )

    hard_delete_hobby(
        db,
        hobby_id,
    )

    return {

        "message": "Hobby deleted successfully",
    }


# ==================================================
# GET ANNOUNCEMENT TYPES
# ==================================================

@router.get(
    "/announcement-types",
)
def list_announcement_types(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    announcement_types = get_announcement_types(
        db
    )

    return {

        "total": len(announcement_types),

        "announcement_types": [

            announcement_type_to_dict(announcement_type)

            for announcement_type in announcement_types
        ],
    }


# ==================================================
# GET ANNOUNCEMENT TYPE BY ID
# ==================================================

@router.get(
    "/announcement-types/{announcement_type_id}",
)
def get_announcement_type(

    announcement_type_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    announcement_type = get_announcement_type_by_id(
        db,
        announcement_type_id,
    )

    if not announcement_type:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement type not found",
        )

    return {

        "announcement_type": announcement_type_to_dict(
            announcement_type
        ),
    }


# ==================================================
# CREATE ANNOUNCEMENT TYPE
# REQUIRES: announcement_type / add
# ==================================================

@router.post(
    "/announcement-types",
    status_code=status.HTTP_201_CREATED,
)
def create_new_announcement_type(

    request: AnnouncementTypeCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("announcement_type", "add")
    ),
):

    if announcement_type_exists(
        db,
        request.announcement_type,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Announcement type already exists",
        )

    announcement_type = create_announcement_type(
        db,
        request.announcement_type,
    )

    return {

        "message": "Announcement type created successfully",

        "announcement_type": announcement_type_to_dict(
            announcement_type
        ),
    }


# ==================================================
# UPDATE ANNOUNCEMENT TYPE
# REQUIRES: announcement_type / edit
# ==================================================

@router.put(
    "/announcement-types/{announcement_type_id}",
)
def update_existing_announcement_type(

    announcement_type_id: int,

    request: AnnouncementTypeUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("announcement_type", "edit")
    ),
):

    existing = get_announcement_type_by_id(
        db,
        announcement_type_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement type not found",
        )

    if announcement_type_exists_for_other(
        db,
        request.announcement_type,
        announcement_type_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Announcement type already exists",
        )

    announcement_type = update_announcement_type(
        db,
        announcement_type_id,
        request.announcement_type,
    )

    return {

        "message": "Announcement type updated successfully",

        "announcement_type": announcement_type_to_dict(
            announcement_type
        ),
    }


# ==================================================
# DELETE ANNOUNCEMENT TYPE
# REQUIRES: announcement_type / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/announcement-types/{announcement_type_id}",
)
def delete_announcement_type(

    announcement_type_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("announcement_type", "delete")
    ),
):

    existing = get_announcement_type_by_id(
        db,
        announcement_type_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement type not found",
        )

    hard_delete_announcement_type(
        db,
        announcement_type_id,
    )

    return {

        "message": "Announcement type deleted successfully",
    }


# ==================================================
# GET OFFICE LEVELS
# ==================================================

@router.get(
    "/office-levels",
)
def list_office_levels(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    office_levels = get_office_levels(
        db
    )

    return {

        "total": len(office_levels),

        "office_levels": [

            office_level_to_dict(office_level)

            for office_level in office_levels
        ],
    }


# ==================================================
# GET OFFICE LEVEL BY ID
# ==================================================

@router.get(
    "/office-levels/{office_level_id}",
)
def get_office_level(

    office_level_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    office_level = get_office_level_by_id(
        db,
        office_level_id,
    )

    if not office_level:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Office level not found",
        )

    return {

        "office_level": office_level_to_dict(office_level),
    }


# ==================================================
# CREATE OFFICE LEVEL
# REQUIRES: office_level / add
# ==================================================

@router.post(
    "/office-levels",
    status_code=status.HTTP_201_CREATED,
)
def create_new_office_level(

    request: OfficeLevelCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("office_level", "add")
    ),
):

    if office_level_exists(
        db,
        request.office_level,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Office level already exists",
        )

    office_level = create_office_level(
        db,
        request.office_level,
    )

    return {

        "message": "Office level created successfully",

        "office_level": office_level_to_dict(office_level),
    }


# ==================================================
# UPDATE OFFICE LEVEL
# REQUIRES: office_level / edit
# ==================================================

@router.put(
    "/office-levels/{office_level_id}",
)
def update_existing_office_level(

    office_level_id: int,

    request: OfficeLevelUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("office_level", "edit")
    ),
):

    existing = get_office_level_by_id(
        db,
        office_level_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Office level not found",
        )

    if office_level_exists_for_other(
        db,
        request.office_level,
        office_level_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Office level already exists",
        )

    office_level = update_office_level(
        db,
        office_level_id,
        request.office_level,
    )

    return {

        "message": "Office level updated successfully",

        "office_level": office_level_to_dict(office_level),
    }


# ==================================================
# DELETE OFFICE LEVEL
# REQUIRES: office_level / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/office-levels/{office_level_id}",
)
def delete_office_level(

    office_level_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("office_level", "delete")
    ),
):

    existing = get_office_level_by_id(
        db,
        office_level_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Office level not found",
        )

    hard_delete_office_level(
        db,
        office_level_id,
    )

    return {

        "message": "Office level deleted successfully",
    }


# ==================================================
# GET MEETING TYPES
# ==================================================

@router.get(
    "/meeting-types",
)
def list_meeting_types(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    meeting_types = get_meeting_types(
        db
    )

    return {

        "total": len(meeting_types),

        "meeting_types": [

            meeting_type_to_dict(meeting_type)

            for meeting_type in meeting_types
        ],
    }


# ==================================================
# GET MEETING TYPE BY ID
# ==================================================

@router.get(
    "/meeting-types/{meeting_type_id}",
)
def get_meeting_type(

    meeting_type_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    meeting_type = get_meeting_type_by_id(
        db,
        meeting_type_id,
    )

    if not meeting_type:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting type not found",
        )

    return {

        "meeting_type": meeting_type_to_dict(meeting_type),
    }


# ==================================================
# CREATE MEETING TYPE
# REQUIRES: meeting_type / add
# ==================================================

@router.post(
    "/meeting-types",
    status_code=status.HTTP_201_CREATED,
)
def create_new_meeting_type(

    request: MeetingTypeCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("meeting_type", "add")
    ),
):

    if meeting_type_exists(
        db,
        request.meeting_type,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meeting type already exists",
        )

    meeting_type = create_meeting_type(
        db,
        request.meeting_type,
    )

    return {

        "message": "Meeting type created successfully",

        "meeting_type": meeting_type_to_dict(meeting_type),
    }


# ==================================================
# UPDATE MEETING TYPE
# REQUIRES: meeting_type / edit
# ==================================================

@router.put(
    "/meeting-types/{meeting_type_id}",
)
def update_existing_meeting_type(

    meeting_type_id: int,

    request: MeetingTypeUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("meeting_type", "edit")
    ),
):

    existing = get_meeting_type_by_id(
        db,
        meeting_type_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting type not found",
        )

    if meeting_type_exists_for_other(
        db,
        request.meeting_type,
        meeting_type_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meeting type already exists",
        )

    meeting_type = update_meeting_type(
        db,
        meeting_type_id,
        request.meeting_type,
    )

    return {

        "message": "Meeting type updated successfully",

        "meeting_type": meeting_type_to_dict(meeting_type),
    }


# ==================================================
# DELETE MEETING TYPE
# REQUIRES: meeting_type / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/meeting-types/{meeting_type_id}",
)
def delete_meeting_type(

    meeting_type_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("meeting_type", "delete")
    ),
):

    existing = get_meeting_type_by_id(
        db,
        meeting_type_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting type not found",
        )

    hard_delete_meeting_type(
        db,
        meeting_type_id,
    )

    return {

        "message": "Meeting type deleted successfully",
    }


# ==================================================
# GET LANGUAGES
# ==================================================

@router.get(
    "/languages",
)
def list_languages(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    languages = get_languages(
        db
    )

    return {

        "total": len(languages),

        "languages": [

            language_to_dict(language)

            for language in languages
        ],
    }


# ==================================================
# GET LANGUAGE BY ID
# ==================================================

@router.get(
    "/languages/{language_id}",
)
def get_language(

    language_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    language = get_language_by_id(
        db,
        language_id,
    )

    if not language:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Language not found",
        )

    return {

        "language": language_to_dict(language),
    }


# ==================================================
# CREATE LANGUAGE
# REQUIRES: language / add
# ==================================================

@router.post(
    "/languages",
    status_code=status.HTTP_201_CREATED,
)
def create_new_language(

    request: LanguageCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("language", "add")
    ),
):

    if language_exists(
        db,
        request.language,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Language already exists",
        )

    language = create_language(
        db,
        request.language,
    )

    return {

        "message": "Language created successfully",

        "language": language_to_dict(language),
    }


# ==================================================
# UPDATE LANGUAGE
# REQUIRES: language / edit
# ==================================================

@router.put(
    "/languages/{language_id}",
)
def update_existing_language(

    language_id: int,

    request: LanguageUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("language", "edit")
    ),
):

    existing = get_language_by_id(
        db,
        language_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Language not found",
        )

    if language_exists_for_other(
        db,
        request.language,
        language_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Language already exists",
        )

    language = update_language(
        db,
        language_id,
        request.language,
    )

    return {

        "message": "Language updated successfully",

        "language": language_to_dict(language),
    }


# ==================================================
# DELETE LANGUAGE
# REQUIRES: language / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/languages/{language_id}",
)
def delete_language(

    language_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("language", "delete")
    ),
):

    existing = get_language_by_id(
        db,
        language_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Language not found",
        )

    hard_delete_language(
        db,
        language_id,
    )

    return {

        "message": "Language deleted successfully",
    }


# ==================================================
# GET REQUIREMENTS
# ==================================================

@router.get(
    "/requirements",
)
def list_requirements(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    requirements = get_requirements(
        db
    )

    return {

        "total": len(requirements),

        "requirements": [

            requirement_to_dict(requirement)

            for requirement in requirements
        ],
    }


# ==================================================
# GET REQUIREMENT BY ID
# ==================================================

@router.get(
    "/requirements/{requirement_id}",
)
def get_requirement(

    requirement_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    requirement = get_requirement_by_id(
        db,
        requirement_id,
    )

    if not requirement:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    return {

        "requirement": requirement_to_dict(requirement),
    }


# ==================================================
# CREATE REQUIREMENT
# REQUIRES: requirement / add
# ==================================================

@router.post(
    "/requirements",
    status_code=status.HTTP_201_CREATED,
)
def create_new_requirement(

    request: RequirementCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("requirement", "add")
    ),
):

    if requirement_exists(
        db,
        request.requirement,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Requirement already exists",
        )

    requirement = create_requirement(
        db,
        request.requirement,
    )

    return {

        "message": "Requirement created successfully",

        "requirement": requirement_to_dict(requirement),
    }


# ==================================================
# UPDATE REQUIREMENT
# REQUIRES: requirement / edit
# ==================================================

@router.put(
    "/requirements/{requirement_id}",
)
def update_existing_requirement(

    requirement_id: int,

    request: RequirementUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("requirement", "edit")
    ),
):

    existing = get_requirement_by_id(
        db,
        requirement_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    if requirement_exists_for_other(
        db,
        request.requirement,
        requirement_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Requirement already exists",
        )

    requirement = update_requirement(
        db,
        requirement_id,
        request.requirement,
    )

    return {

        "message": "Requirement updated successfully",

        "requirement": requirement_to_dict(requirement),
    }


# ==================================================
# DELETE REQUIREMENT
# REQUIRES: requirement / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/requirements/{requirement_id}",
)
def delete_requirement(

    requirement_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("requirement", "delete")
    ),
):

    existing = get_requirement_by_id(
        db,
        requirement_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requirement not found",
        )

    hard_delete_requirement(
        db,
        requirement_id,
    )

    return {

        "message": "Requirement deleted successfully",
    }



# ==================================================
# GET ADVERTISING MEDIAS
# ==================================================

@router.get(
    "/advertising-medias",
)
def list_advertising_medias(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    advertising_medias = get_advertising_medias(
        db
    )

    return {

        "total": len(advertising_medias),

        "advertising_medias": [

            advertising_media_to_dict(item)

            for item in advertising_medias
        ],
    }


# ==================================================
# GET ADVERTISING MEDIA BY ID
# ==================================================

@router.get(
    "/advertising-medias/{advertising_media_id}",
)
def get_advertising_media(

    advertising_media_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    advertising_media = get_advertising_media_by_id(
        db,
        advertising_media_id,
    )

    if not advertising_media:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertising media not found",
        )

    return {

        "advertising_media": advertising_media_to_dict(
            advertising_media
        ),
    }


# ==================================================
# CREATE ADVERTISING MEDIA
# REQUIRES: advertising_media / add
# ==================================================

@router.post(
    "/advertising-medias",
    status_code=status.HTTP_201_CREATED,
)
def create_new_advertising_media(

    request: AdvertisingMediaCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("advertising_media", "add")
    ),
):

    if advertising_media_exists(
        db,
        request.advertising_media,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Advertising media already exists",
        )

    advertising_media = create_advertising_media(
        db,
        request.advertising_media,
    )

    return {

        "message": "Advertising media created successfully",

        "advertising_media": advertising_media_to_dict(
            advertising_media
        ),
    }


# ==================================================
# UPDATE ADVERTISING MEDIA
# REQUIRES: advertising_media / edit
# ==================================================

@router.put(
    "/advertising-medias/{advertising_media_id}",
)
def update_existing_advertising_media(

    advertising_media_id: int,

    request: AdvertisingMediaUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("advertising_media", "edit")
    ),
):

    existing = get_advertising_media_by_id(
        db,
        advertising_media_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertising media not found",
        )

    if advertising_media_exists_for_other(
        db,
        request.advertising_media,
        advertising_media_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Advertising media already exists",
        )

    advertising_media = update_advertising_media(
        db,
        advertising_media_id,
        request.advertising_media,
    )

    return {

        "message": "Advertising media updated successfully",

        "advertising_media": advertising_media_to_dict(
            advertising_media
        ),
    }


# ==================================================
# DELETE ADVERTISING MEDIA
# REQUIRES: advertising_media / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/advertising-medias/{advertising_media_id}",
)
def delete_advertising_media(

    advertising_media_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("advertising_media", "delete")
    ),
):

    existing = get_advertising_media_by_id(
        db,
        advertising_media_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertising media not found",
        )

    hard_delete_advertising_media(
        db,
        advertising_media_id,
    )

    return {

        "message": "Advertising media deleted successfully",
    }



# ==================================================
# GET ADVERTISING PURPOSES
# ==================================================

@router.get(
    "/advertising-purposes",
)
def list_advertising_purposes(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    advertising_purposes = get_advertising_purposes(
        db
    )

    return {

        "total": len(advertising_purposes),

        "advertising_purposes": [

            advertising_purpose_to_dict(item)

            for item in advertising_purposes
        ],
    }


# ==================================================
# GET ADVERTISING PURPOSE BY ID
# ==================================================

@router.get(
    "/advertising-purposes/{advertising_purpose_id}",
)
def get_advertising_purpose(

    advertising_purpose_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    advertising_purpose = get_advertising_purpose_by_id(
        db,
        advertising_purpose_id,
    )

    if not advertising_purpose:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertising purpose not found",
        )

    return {

        "advertising_purpose": advertising_purpose_to_dict(
            advertising_purpose
        ),
    }


# ==================================================
# CREATE ADVERTISING PURPOSE
# REQUIRES: advertising_purpose / add
# ==================================================

@router.post(
    "/advertising-purposes",
    status_code=status.HTTP_201_CREATED,
)
def create_new_advertising_purpose(

    request: AdvertisingPurposeCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("advertising_purpose", "add")
    ),
):

    if advertising_purpose_exists(
        db,
        request.advertising_purpose,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Advertising purpose already exists",
        )

    advertising_purpose = create_advertising_purpose(
        db,
        request.advertising_purpose,
    )

    return {

        "message": "Advertising purpose created successfully",

        "advertising_purpose": advertising_purpose_to_dict(
            advertising_purpose
        ),
    }


# ==================================================
# UPDATE ADVERTISING PURPOSE
# REQUIRES: advertising_purpose / edit
# ==================================================

@router.put(
    "/advertising-purposes/{advertising_purpose_id}",
)
def update_existing_advertising_purpose(

    advertising_purpose_id: int,

    request: AdvertisingPurposeUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("advertising_purpose", "edit")
    ),
):

    existing = get_advertising_purpose_by_id(
        db,
        advertising_purpose_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertising purpose not found",
        )

    if advertising_purpose_exists_for_other(
        db,
        request.advertising_purpose,
        advertising_purpose_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Advertising purpose already exists",
        )

    advertising_purpose = update_advertising_purpose(
        db,
        advertising_purpose_id,
        request.advertising_purpose,
    )

    return {

        "message": "Advertising purpose updated successfully",

        "advertising_purpose": advertising_purpose_to_dict(
            advertising_purpose
        ),
    }


# ==================================================
# DELETE ADVERTISING PURPOSE
# REQUIRES: advertising_purpose / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/advertising-purposes/{advertising_purpose_id}",
)
def delete_advertising_purpose(

    advertising_purpose_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("advertising_purpose", "delete")
    ),
):

    existing = get_advertising_purpose_by_id(
        db,
        advertising_purpose_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertising purpose not found",
        )

    hard_delete_advertising_purpose(
        db,
        advertising_purpose_id,
    )

    return {

        "message": "Advertising purpose deleted successfully",
    }



# ==================================================
# GET OFFICE TYPES
# ==================================================

@router.get(
    "/office-types",
)
def list_office_types(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    office_types = get_office_types(
        db
    )

    return {

        "total": len(office_types),

        "office_types": [

            office_type_to_dict(item)

            for item in office_types
        ],
    }


# ==================================================
# GET OFFICE TYPE BY ID
# ==================================================

@router.get(
    "/office-types/{office_type_id}",
)
def get_office_type(

    office_type_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    office_type = get_office_type_by_id(
        db,
        office_type_id,
    )

    if not office_type:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Office type not found",
        )

    return {

        "office_type": office_type_to_dict(
            office_type
        ),
    }


# ==================================================
# CREATE OFFICE TYPE
# REQUIRES: office_type / add
# ==================================================

@router.post(
    "/office-types",
    status_code=status.HTTP_201_CREATED,
)
def create_new_office_type(

    request: OfficeTypeCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("office_type", "add")
    ),
):

    if office_type_exists(
        db,
        request.office_type,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Office type already exists",
        )

    office_type = create_office_type(
        db,
        request.office_type,
    )

    return {

        "message": "Office type created successfully",

        "office_type": office_type_to_dict(
            office_type
        ),
    }


# ==================================================
# UPDATE OFFICE TYPE
# REQUIRES: office_type / edit
# ==================================================

@router.put(
    "/office-types/{office_type_id}",
)
def update_existing_office_type(

    office_type_id: int,

    request: OfficeTypeUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("office_type", "edit")
    ),
):

    existing = get_office_type_by_id(
        db,
        office_type_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Office type not found",
        )

    if office_type_exists_for_other(
        db,
        request.office_type,
        office_type_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Office type already exists",
        )

    office_type = update_office_type(
        db,
        office_type_id,
        request.office_type,
    )

    return {

        "message": "Office type updated successfully",

        "office_type": office_type_to_dict(
            office_type
        ),
    }


# ==================================================
# DELETE OFFICE TYPE
# REQUIRES: office_type / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/office-types/{office_type_id}",
)
def delete_office_type(

    office_type_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("office_type", "delete")
    ),
):

    existing = get_office_type_by_id(
        db,
        office_type_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Office type not found",
        )

    hard_delete_office_type(
        db,
        office_type_id,
    )

    return {

        "message": "Office type deleted successfully",
    }



# ==================================================
# GET MEETING LOCATIONS
# ==================================================

@router.get(
    "/meeting-locations",
)
def list_meeting_locations(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    meeting_locations = get_meeting_locations(
        db
    )

    return {

        "total": len(meeting_locations),

        "meeting_locations": [

            meeting_location_to_dict(item)

            for item in meeting_locations
        ],
    }


# ==================================================
# GET MEETING LOCATION BY ID
# ==================================================

@router.get(
    "/meeting-locations/{meeting_location_id}",
)
def get_meeting_location(

    meeting_location_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    meeting_location = get_meeting_location_by_id(
        db,
        meeting_location_id,
    )

    if not meeting_location:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting location not found",
        )

    return {

        "meeting_location": meeting_location_to_dict(
            meeting_location
        ),
    }


# ==================================================
# CREATE MEETING LOCATION
# REQUIRES: meeting_location / add
# ==================================================

@router.post(
    "/meeting-locations",
    status_code=status.HTTP_201_CREATED,
)
def create_new_meeting_location(

    request: MeetingLocationCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("meeting_location", "add")
    ),
):

    if meeting_location_exists(
        db,
        request.meeting_location,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meeting location already exists",
        )

    meeting_location = create_meeting_location(
        db,
        request.meeting_location,
    )

    return {

        "message": "Meeting location created successfully",

        "meeting_location": meeting_location_to_dict(
            meeting_location
        ),
    }


# ==================================================
# UPDATE MEETING LOCATION
# REQUIRES: meeting_location / edit
# ==================================================

@router.put(
    "/meeting-locations/{meeting_location_id}",
)
def update_existing_meeting_location(

    meeting_location_id: int,

    request: MeetingLocationUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("meeting_location", "edit")
    ),
):

    existing = get_meeting_location_by_id(
        db,
        meeting_location_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting location not found",
        )

    if meeting_location_exists_for_other(
        db,
        request.meeting_location,
        meeting_location_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meeting location already exists",
        )

    meeting_location = update_meeting_location(
        db,
        meeting_location_id,
        request.meeting_location,
    )

    return {

        "message": "Meeting location updated successfully",

        "meeting_location": meeting_location_to_dict(
            meeting_location
        ),
    }


# ==================================================
# DELETE MEETING LOCATION
# REQUIRES: meeting_location / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/meeting-locations/{meeting_location_id}",
)
def delete_meeting_location(

    meeting_location_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("meeting_location", "delete")
    ),
):

    existing = get_meeting_location_by_id(
        db,
        meeting_location_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting location not found",
        )

    hard_delete_meeting_location(
        db,
        meeting_location_id,
    )

    return {

        "message": "Meeting location deleted successfully",
    }



# ==================================================
# GET KSAs
# ==================================================

@router.get(
    "/ksas",
)
def list_ksas(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    ksas = get_ksas(
        db
    )

    return {

        "total": len(ksas),

        "ksas": [

            ksa_to_dict(item)

            for item in ksas
        ],
    }


# ==================================================
# GET KSA BY ID
# ==================================================

@router.get(
    "/ksas/{ksa_id}",
)
def get_ksa(

    ksa_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    ksa = get_ksa_by_id(
        db,
        ksa_id,
    )

    if not ksa:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="KSA not found",
        )

    return {

        "ksa": ksa_to_dict(
            ksa
        ),
    }


# ==================================================
# CREATE KSA
# REQUIRES: ksa / add
# ==================================================

@router.post(
    "/ksas",
    status_code=status.HTTP_201_CREATED,
)
def create_new_ksa(

    request: KSACreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ksa", "add")
    ),
):

    if ksa_exists(
        db,
        request.ksa,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="KSA already exists",
        )

    ksa = create_ksa(
        db,
        request.ksa,
    )

    return {

        "message": "KSA created successfully",

        "ksa": ksa_to_dict(
            ksa
        ),
    }


# ==================================================
# UPDATE KSA
# REQUIRES: ksa / edit
# ==================================================

@router.put(
    "/ksas/{ksa_id}",
)
def update_existing_ksa(

    ksa_id: int,

    request: KSAUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ksa", "edit")
    ),
):

    existing = get_ksa_by_id(
        db,
        ksa_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="KSA not found",
        )

    if ksa_exists_for_other(
        db,
        request.ksa,
        ksa_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="KSA already exists",
        )

    ksa = update_ksa(
        db,
        ksa_id,
        request.ksa,
    )

    return {

        "message": "KSA updated successfully",

        "ksa": ksa_to_dict(
            ksa
        ),
    }


# ==================================================
# DELETE KSA
# REQUIRES: ksa / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/ksas/{ksa_id}",
)
def delete_ksa(

    ksa_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ksa", "delete")
    ),
):

    existing = get_ksa_by_id(
        db,
        ksa_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="KSA not found",
        )

    hard_delete_ksa(
        db,
        ksa_id,
    )

    return {

        "message": "KSA deleted successfully",
    }



# ==================================================
# GET KSA CATEGORIES
# ==================================================

@router.get(
    "/ksa-categories",
)
def list_ksa_categories(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    ksa_categories = get_ksa_categories(
        db
    )

    return {

        "total": len(ksa_categories),

        "ksa_categories": [

            ksa_category_to_dict(item)

            for item in ksa_categories
        ],
    }


# ==================================================
# GET KSA CATEGORY BY ID
# ==================================================

@router.get(
    "/ksa-categories/{ksa_category_id}",
)
def get_ksa_category(

    ksa_category_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    ksa_category = get_ksa_category_by_id(
        db,
        ksa_category_id,
    )

    if not ksa_category:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="KSA category not found",
        )

    return {

        "ksa_category": ksa_category_to_dict(
            ksa_category
        ),
    }


# ==================================================
# CREATE KSA CATEGORY
# REQUIRES: ksa_category / add
# ==================================================

@router.post(
    "/ksa-categories",
    status_code=status.HTTP_201_CREATED,
)
def create_new_ksa_category(

    request: KSACategoryCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ksa_category", "add")
    ),
):

    if ksa_category_exists(
        db,
        request.ksa_category,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="KSA category already exists",
        )

    ksa_category = create_ksa_category(
        db,
        request.ksa_category,
    )

    return {

        "message": "KSA category created successfully",

        "ksa_category": ksa_category_to_dict(
            ksa_category
        ),
    }


# ==================================================
# UPDATE KSA CATEGORY
# REQUIRES: ksa_category / edit
# ==================================================

@router.put(
    "/ksa-categories/{ksa_category_id}",
)
def update_existing_ksa_category(

    ksa_category_id: int,

    request: KSACategoryUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ksa_category", "edit")
    ),
):

    existing = get_ksa_category_by_id(
        db,
        ksa_category_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="KSA category not found",
        )

    if ksa_category_exists_for_other(
        db,
        request.ksa_category,
        ksa_category_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="KSA category already exists",
        )

    ksa_category = update_ksa_category(
        db,
        ksa_category_id,
        request.ksa_category,
    )

    return {

        "message": "KSA category updated successfully",

        "ksa_category": ksa_category_to_dict(
            ksa_category
        ),
    }


# ==================================================
# DELETE KSA CATEGORY
# REQUIRES: ksa_category / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/ksa-categories/{ksa_category_id}",
)
def delete_ksa_category(

    ksa_category_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ksa_category", "delete")
    ),
):

    existing = get_ksa_category_by_id(
        db,
        ksa_category_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="KSA category not found",
        )

    hard_delete_ksa_category(
        db,
        ksa_category_id,
    )

    return {

        "message": "KSA category deleted successfully",
    }



# ==================================================
# GET POSITION GRADES
# ==================================================

@router.get(
    "/position-grades",
)
def list_position_grades(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    position_grades = get_position_grades(
        db
    )

    return {

        "total": len(position_grades),

        "position_grades": [

            position_grade_to_dict(item)

            for item in position_grades
        ],
    }


# ==================================================
# GET POSITION GRADE BY ID
# ==================================================

@router.get(
    "/position-grades/{position_grade_id}",
)
def get_position_grade(

    position_grade_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    position_grade = get_position_grade_by_id(
        db,
        position_grade_id,
    )

    if not position_grade:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position grade not found",
        )

    return {

        "position_grade": position_grade_to_dict(
            position_grade
        ),
    }


# ==================================================
# CREATE POSITION GRADE
# REQUIRES: position_grade / add
# ==================================================

@router.post(
    "/position-grades",
    status_code=status.HTTP_201_CREATED,
)
def create_new_position_grade(

    request: PositionGradeCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("position_grade", "add")
    ),
):

    if request.minimum_pay > request.maximum_pay:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum pay cannot be greater than maximum pay",
        )

    if position_grade_exists(
        db,
        request.position_grade,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Position grade already exists",
        )

    position_grade = create_position_grade(
        db,
        request.position_grade,
        request.minimum_pay,
        request.maximum_pay,
    )

    return {

        "message": "Position grade created successfully",

        "position_grade": position_grade_to_dict(
            position_grade
        ),
    }


# ==================================================
# UPDATE POSITION GRADE
# REQUIRES: position_grade / edit
# ==================================================

@router.put(
    "/position-grades/{position_grade_id}",
)
def update_existing_position_grade(

    position_grade_id: int,

    request: PositionGradeUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("position_grade", "edit")
    ),
):

    existing = get_position_grade_by_id(
        db,
        position_grade_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position grade not found",
        )

    if request.minimum_pay > request.maximum_pay:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum pay cannot be greater than maximum pay",
        )

    if position_grade_exists_for_other(
        db,
        request.position_grade,
        position_grade_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Position grade already exists",
        )

    position_grade = update_position_grade(
        db,
        position_grade_id,
        request.position_grade,
        request.minimum_pay,
        request.maximum_pay,
    )

    return {

        "message": "Position grade updated successfully",

        "position_grade": position_grade_to_dict(
            position_grade
        ),
    }


# ==================================================
# DELETE POSITION GRADE
# REQUIRES: position_grade / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/position-grades/{position_grade_id}",
)
def delete_position_grade(

    position_grade_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("position_grade", "delete")
    ),
):

    existing = get_position_grade_by_id(
        db,
        position_grade_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position grade not found",
        )

    hard_delete_position_grade(
        db,
        position_grade_id,
    )

    return {

        "message": "Position grade deleted successfully",
    }



# ==================================================
# GET ROLE IN OFFENSES
# ==================================================

@router.get(
    "/role-in-offenses",
)
def list_role_in_offenses(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    items = get_role_in_offenses(
        db
    )

    return {

        "total": len(items),

        "role_in_offenses": [

            role_in_offense_to_dict(item)

            for item in items
        ],
    }


# ==================================================
# GET ROLE IN OFFENSE BY ID
# ==================================================

@router.get(
    "/role-in-offenses/{role_in_offense_id}",
)
def get_role_in_offense(

    role_in_offense_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    item = get_role_in_offense_by_id(
        db,
        role_in_offense_id,
    )

    if not item:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role in offense not found",
        )

    return {

        "role_in_offense": role_in_offense_to_dict(
            item
        ),
    }


# ==================================================
# CREATE ROLE IN OFFENSE
# REQUIRES: role_in_offense / add
# ==================================================

@router.post(
    "/role-in-offenses",
    status_code=status.HTTP_201_CREATED,
)
def create_new_role_in_offense(

    request: RoleInOffenseCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("role_in_offense", "add")
    ),
):

    if request.minimum_penalty > request.maximum_penalty:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum penalty cannot be greater than maximum penalty",
        )

    if role_in_offense_exists(
        db,
        request.role_in_offense,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role in offense already exists",
        )

    item = create_role_in_offense(
        db,
        request.role_in_offense,
        request.minimum_penalty,
        request.maximum_penalty,
    )

    return {

        "message": "Role in offense created successfully",

        "role_in_offense": role_in_offense_to_dict(
            item
        ),
    }


# ==================================================
# UPDATE ROLE IN OFFENSE
# REQUIRES: role_in_offense / edit
# ==================================================

@router.put(
    "/role-in-offenses/{role_in_offense_id}",
)
def update_existing_role_in_offense(

    role_in_offense_id: int,

    request: RoleInOffenseUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("role_in_offense", "edit")
    ),
):

    existing = get_role_in_offense_by_id(
        db,
        role_in_offense_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role in offense not found",
        )

    if request.minimum_penalty > request.maximum_penalty:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum penalty cannot be greater than maximum penalty",
        )

    if role_in_offense_exists_for_other(
        db,
        request.role_in_offense,
        role_in_offense_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role in offense already exists",
        )

    item = update_role_in_offense(
        db,
        role_in_offense_id,
        request.role_in_offense,
        request.minimum_penalty,
        request.maximum_penalty,
    )

    return {

        "message": "Role in offense updated successfully",

        "role_in_offense": role_in_offense_to_dict(
            item
        ),
    }


# ==================================================
# DELETE ROLE IN OFFENSE
# REQUIRES: role_in_offense / delete
# HARD DELETE (Phase 2)
# ==================================================

@router.delete(
    "/role-in-offenses/{role_in_offense_id}",
)
def delete_role_in_offense(

    role_in_offense_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("role_in_offense", "delete")
    ),
):

    existing = get_role_in_offense_by_id(
        db,
        role_in_offense_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role in offense not found",
        )

    hard_delete_role_in_offense(
        db,
        role_in_offense_id,
    )

    return {

        "message": "Role in offense deleted successfully",
    }



# ==================================================
# GET MY OWN RIGHTS
# ANY LOGGED-IN USER
# Used by the frontend to decide what to show/hide
# for the person currently logged in.
# ==================================================

@router.get(
    "/user-rights/me",
)
def get_my_rights(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    rights_map = get_user_rights_map(
        db,
        current_user["pkid"],
    )

    return {

        "role": current_user["role"],

        "rights": rights_map,
    }


# ==================================================
# GET A USER'S RIGHTS
# ADMIN ONLY
# Used to populate the User Rights matrix when an
# admin selects a user.
# ==================================================

@router.get(
    "/user-rights/{user_id}",
)
def get_rights_for_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    target_user = get_user_by_id(
        db,
        user_id,
    )

    if not target_user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    rights_map = get_user_rights_map(
        db,
        user_id,
    )

    return {

        "user_id": user_id,

        "rights": rights_map,
    }


# ==================================================
# SET A USER'S RIGHTS
# ADMIN ONLY
# Saves the whole matrix for one user in a single
# call, replacing whatever was there before for each
# module included in the request.
# ==================================================

@router.put(
    "/user-rights/{user_id}",
)
def set_rights_for_user(

    user_id: int,

    request: SetUserRightsRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    target_user = get_user_by_id(
        db,
        user_id,
    )

    if not target_user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    rights_list = [
        item.model_dump()
        for item in request.rights
    ]

    updated_rows = set_user_rights_bulk(
        db,
        user_id,
        rights_list,
    )

    return {

        "message": "User rights updated successfully",

        "rights": [
            user_right_to_dict(row)
            for row in updated_rows
        ],
    }
