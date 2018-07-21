import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideOutSidebarComponent } from './slide-out-sidebar.component';

describe('SlideOutSidebarComponent', () => {
  let component: SlideOutSidebarComponent;
  let fixture: ComponentFixture<SlideOutSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideOutSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideOutSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
