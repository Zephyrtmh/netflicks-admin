import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorManagmentComponent } from './actor-managment.component';

describe('ActorManagmentComponent', () => {
  let component: ActorManagmentComponent;
  let fixture: ComponentFixture<ActorManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActorManagmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
