import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServidorSearchComponent } from './servidor-search.component';

describe('ServidorSearchComponent', () => {
  let component: ServidorSearchComponent;
  let fixture: ComponentFixture<ServidorSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServidorSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServidorSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
