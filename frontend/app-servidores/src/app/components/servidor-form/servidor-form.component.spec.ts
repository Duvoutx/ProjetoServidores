import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServidorFormComponent } from './servidor-form.component';

describe('ServidorFormComponent', () => {
  let component: ServidorFormComponent;
  let fixture: ComponentFixture<ServidorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServidorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServidorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
