export const EVENT_OPEN_CREATE_WORKSHOP = "open-create-workshop";
export const EVENT_WORKSHOP_CREATED = "workshop-created";

// 서버 생성 모달 열기
export function openCreateWorkshopModal() {
  window.dispatchEvent(new CustomEvent(EVENT_OPEN_CREATE_WORKSHOP));
}

// 워크샵 생성 성공 시 전역 알림
export function announceWorkshopCreated(workshop) {
  window.dispatchEvent(new CustomEvent(EVENT_WORKSHOP_CREATED, { detail: workshop }));
}